import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { TipoMarcacaoPonto } from './TipoMarcacaoPonto.entity';

@Entity({ name: 'PIXIE_ARQUIVO_AFD' })
export class RegistroPonto {
  @PrimaryColumn({ name: 'ID', default: () => 'SEQ_pixie_arquivo_afd.NEXTVAL' })
  id: number;

  @Column({ name: 'MAT', type: 'varchar', nullable: true })
  mat: string;

  @Column({ name: 'CPF', type: 'varchar', length: 11, nullable: true })
  cpf: string;

  @Column({ name: 'PIS', type: 'varchar', length: 12, nullable: true })
  pis: string;

  @Column({ name: 'NOME', type: 'varchar', nullable: true })
  nome: string;

  @Column({ name: 'DATA', type: 'timestamp', nullable: true }) // 'date' armazena só AAAA-MM-DD
  data: Date; // Pode usar 'string' se preferir

  @Column({ name: 'DATA_ENTRADA', type: 'timestamp', nullable: true }) // 'timestamp' armazena data e hora
  dataEntrada: Date;

  @Column({ name: 'HORA', type: 'varchar', length: 5, nullable: true }) // Para armazenar como texto "HH:MM"
  hora: string;

  @Column({
    name: 'HORA_NUMBER',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  }) // Para armazenar 8.50 (8h 30m)
  horaNumber: number;

  @Column({ name: 'DATA_HORA_ARQ', type: 'timestamp', nullable: true })
  dataHoraAr: Date;

  @ManyToOne(() => TipoMarcacaoPonto)
  @JoinColumn({ name: 'ID' })
  marcacao: TipoMarcacaoPonto[];

  // @Column({ name: 'TIPO_MARCACA', type: 'varchar', length: 50, nullable: true })
  // tipoMarcacao: string;

  // @Column({ name: 'TURNO_ATUAL', type: 'varchar', length: 50, nullable: true })
  // turnoAtual: string;

  // @Column({ name: 'CENTRO_CUSTO', type: 'varchar', length: 100, nullable: true })
  // centroCusto: string;
}
