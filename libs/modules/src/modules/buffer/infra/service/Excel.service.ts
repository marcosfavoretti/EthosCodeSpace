import { format, startOfDay, startOfToday } from 'date-fns';
import * as ExcelJS from 'exceljs';

export class ExcelService {
  /**
   * Cria um novo workbook e adiciona uma worksheet com os dados fornecidos.
   *
   * @param data - Array de objetos a serem escritos.
   * @param sheetName - Nome da nova aba.
   */
  async createWorkbook<T extends object>(
    data: T[],
    sheetName: string,
  ): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
      sheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));

      data.forEach((item) => {
        sheet.addRow(item);
      });
    }

    return workbook;
  }

  /**
   * Remove todas as linhas de uma aba que possuem o mesmo valor em uma coluna de data,
   * caso esse valor já exista antes de inserir novos dados.
   *
   * @param workbook - O workbook ExcelJS.
   * @param sheetName - Nome da aba.
   * @param dateColumn - Nome da coluna de data (deve ser igual ao key do objeto).
   * @param dateValue - Valor da data a ser verificada/removida (string ou Date).
   */
  removeRowsByDate(
    workbook: ExcelJS.Workbook,
    sheetName: string,
    indexColumn: number,
    dateValue: Date,
  ): void {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) return;
    const rowsToRemove: number[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        const cell = row.getCell(indexColumn).value as Date;
        if (cell.getTime() === dateValue.getTime()) {
          rowsToRemove.push(rowNumber);
        }
      }
    });
    console.log(`Removendo ${rowsToRemove.length} linhas da aba ${sheetName}`);
    rowsToRemove.reverse().forEach((rowNum) => sheet.spliceRows(rowNum, 1));
  }

  /**
   * Abre um workbook a partir de um Buffer em memória.
   * * @param buffer - O Buffer do arquivo .xlsx.
   */
  async openWorkBook(buffer: Buffer): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    // MUDANÇA AQUI: de readFile para load
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    return workbook;
  }

  /**
   * Verifica se uma aba existe.
   */
  sheetExists(workbook: ExcelJS.Workbook, sheetName: string): boolean {
    return workbook.getWorksheet(sheetName) !== undefined;
  }

  /**
   * Adiciona dados a uma aba existente, criando-a se necessário.
   */
  appendToSheet<T extends object>(
    workbook: ExcelJS.Workbook,
    data: T[],
    sheetName: string,
  ): ExcelJS.Workbook {
    let sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      sheet = workbook.addWorksheet(sheetName);
      sheet.columns = Object.keys(data[0] || {}).map((key) => ({
        header: key,
        key,
        width: 20,
      }));
    }

    data.forEach((item) => {
      sheet.addRow(item);
    });

    return workbook;
  }

  /**
   * Adiciona dados ao final da aba existente (sem cabeçalhos).
   */
  appendDataToEnd<T extends object>(
    workbook: ExcelJS.Workbook,
    data: T[],
    sheetName: string,
  ): ExcelJS.Workbook {
    if (data.length === 0) {
      return workbook; // Não faz nada se não houver dados
    }
    let sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      sheet = workbook.addWorksheet(sheetName);
      sheet.columns = Object.keys(data[0]).map((key) => ({
        header: key, // O texto que aparece no cabeçalho
        key: key, // O identificador da coluna
        width: 20,
      }));
    }
    if (!sheet.columns || sheet.columns.length === 0) {
      sheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key: key,
      }));
    }
    console.log(`Adicionando ${data.length} linhas na aba ${sheetName}`);
    data.forEach((item) => {
      sheet.addRow(Object.values(item));
    });
    return workbook;
  }

  /**
   * Retorna o workbook como um Buffer em memória.
   */
  async getWorkbookBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
    // O writeBuffer() no ambiente Node.js retorna um Buffer
    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  /**
   * Salva o workbook como um arquivo local.
   */
  async saveToFile(
    workbook: ExcelJS.Workbook,
    filePath: string,
  ): Promise<void> {
    await workbook.xlsx.writeFile(filePath);
  }
  /**
   * Exporta diretamente um arquivo com dados (browser não suportado aqui).
   */
  static async exportAsFile<T extends object>(
    data: T[],
    filePath: string,
    sheetName: string = 'Sheet1',
  ): Promise<void> {
    const service = new ExcelService();
    const workbook = await service.createWorkbook(data, sheetName);
    await workbook.xlsx.writeFile(filePath);
  }
}
