import { Injectable, Logger } from '@nestjs/common';
import {
  CertificadosOutput,
  TestGroup,
  TestStep,
} from '../class/CertificadoOutput';
import * as fs from 'fs/promises';
import * as path from 'path'; // <--- 1. Importar o módulo path

@Injectable()
export class ProcessadorCertificadoToJson {
  // Regex Patterns (Readonly para garantir que não sejam alterados)
  private readonly regexHeader =
    /\*[`]?(?:Teste iniciado|Testing Initiated):[`\s]*(?:Operador|Operator):?[`]?\s*(?<operator>.+?)\s+(?<dateTime>.+?[AP]M)(?:\s+Test Stand:\s+(?<testStand>.+))?/;
  private readonly regexRops = /ROP's:\s+(?<rops>\d+)/;
  private readonly regexGroupStart =
    /Test Selection Name:\s+(?<name>\w+)\s+(?<date>.+)\s+(?<time>\d{1,2}:\d{2}\s+[AP]M)/;
  private readonly regexGroupEnd =
    /Entire Test\((?<count>\d+)\s+Individual Tests\)\s+Cumulativo\s+(?<duration>[\d:]+)/;
  // Regex complexo para capturar linha de teste com ou sem medidas
  private readonly regexStep =
    /^\s*(?<category>\w+)\s+(?<status>Pass|OK|Fail)\s+(?<description>.+?)(?:\s+(?<valMeas>-?[\d\.]+)\s*(?:\((?<valRef>-?[\d\.]+)\))?\s+(?<valLimit>[\d\.]+)\s*(?<unit>[A-Za-z]+))?\s+(?<time>\d{1,2}:\d{2}\s+[AP]M)\s*$/;

  // Estado interno
  private output: CertificadosOutput;
  private currentGroup: TestGroup | undefined = undefined;

  constructor() {
    this.reset();
  }

  /**
   * Reseta o estado do parser para processar um novo arquivo.
   */
  private reset(): void {
    this.output = {
      metadata: {
        serianumber: undefined, // <--- 2. Inicializa como undefined
        operator: undefined,
        test_stand: undefined,
        start_timestamp: undefined,
        rops: undefined,
        processed_at: new Date().toISOString(),
      },
      test_groups: [],
    };
    this.currentGroup = undefined;
  }

  /**
   * Método principal: Lê um arquivo do disco e retorna o JSON estruturado.
   */
  async parseFile(filePath: string): Promise<CertificadosOutput> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // <--- 3. Lógica para extrair o nome do arquivo (sem extensão)
      // Ex: de "uploads/logs/SN12345.txt" pega apenas "SN12345"
      const serialNumber = path.parse(filePath).name;

      // <--- 4. Passa o serialNumber para o parseString
      return this.parseString(content, serialNumber);
    } catch (error) {
      Logger.error('falha de permisão');
      throw error;
    }
  }

  /**
   * Processa o conteúdo bruto de string.
   * Agora aceita um serialNumber opcional.
   */
  public parseString(
    content: string,
    serialNumber: string | undefined = undefined,
  ): CertificadosOutput {
    this.reset();

    // <--- 5. Se o serialNumber foi passado, salva no metadata
    if (serialNumber) {
      this.output.metadata.serianumber = serialNumber;
    }

    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      this.processLine(line.trim());
    }

    // Caso o arquivo termine abruptamente, salva o último grupo se ele existir
    if (this.currentGroup) {
      this.output.test_groups.push(this.currentGroup);
    }

    return this.output;
  }

  /**
   * Lógica de processamento linha a linha (Máquina de Estados).
   */
  private processLine(line: string): void {
    if (!line) return;

    // 1. Header
    const headerMatch = this.regexHeader.exec(line);
    if (headerMatch && headerMatch.groups) {
      this.output.metadata.operator = headerMatch.groups.operator.trim();
      this.output.metadata.start_timestamp = headerMatch.groups.dateTime.trim();
      this.output.metadata.test_stand = headerMatch.groups?.testStand?.trim();
      return;
    }

    // 2. ROPs
    const ropsMatch = this.regexRops.exec(line);
    if (ropsMatch && ropsMatch.groups) {
      this.output.metadata.rops = ropsMatch.groups.rops;
      return;
    }

    // 3. Start Group
    const startMatch = this.regexGroupStart.exec(line);
    if (startMatch && startMatch.groups) {
      this.finalizeCurrentGroup(); // Fecha o anterior se existir

      this.currentGroup = {
        name: startMatch.groups.name,
        timestamp: `${startMatch.groups.date} ${startMatch.groups.time}`,
        status_summary: 'Incomplete',
        stats: { total_steps: 0, duration: '0:00' },
        steps: [],
      };
      return;
    }

    // 4. End Group
    const endMatch = this.regexGroupEnd.exec(line);
    if (endMatch && endMatch.groups && this.currentGroup) {
      this.currentGroup.stats.total_steps = parseInt(endMatch.groups.count, 10);
      this.currentGroup.stats.duration = endMatch.groups.duration;

      // Determina se o grupo passou ou falhou baseado nos passos internos
      const hasFailure = this.currentGroup.steps.some(
        (step) => step.status === 'Fail',
      );
      this.currentGroup.status_summary = hasFailure ? 'Fail' : 'Pass';

      this.finalizeCurrentGroup();
      return;
    }

    // 5. Steps (Linhas de teste)
    if (this.currentGroup) {
      const stepMatch = this.regexStep.exec(line);
      // Verifica se a linha pertence ao grupo atual (Safety Check)
      if (
        stepMatch &&
        stepMatch.groups &&
        stepMatch.groups.category === this.currentGroup.name
      ) {
        this.addStepToGroup(stepMatch.groups);
      }
    }
  }

  /**
   * Salva o grupo atual na lista principal e limpa a variável temporária.
   */
  private finalizeCurrentGroup(): void {
    if (this.currentGroup) {
      this.output.test_groups.push(this.currentGroup);
      this.currentGroup = undefined;
    }
  }

  /**
   * Helper para formatar e adicionar um passo ao grupo.
   */
  private addStepToGroup(groups: { [key: string]: string }): void {
    if (!this.currentGroup) return;

    const step: TestStep = {
      description: groups.description.trim(),
      status: groups.status as 'Pass' | 'Fail' | 'OK',
      timestamp: groups.time,
      measurements: undefined,
    };

    if (groups.valMeas) {
      step.measurements = {
        value: parseFloat(groups.valMeas),
        limit: parseFloat(groups.valLimit),
        unit: groups.unit,
        reference: groups.valRef ? parseFloat(groups.valRef) : undefined,
      };
    }

    this.currentGroup.steps.push(step);
  }
}
