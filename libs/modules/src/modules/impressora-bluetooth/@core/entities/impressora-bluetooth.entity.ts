import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('impressoras_bluetooth')
export class ImpressoraBluetooth {
  @ApiProperty({
    description: 'Identificador único da impressora',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome da impressora',
    example: 'Impressora Sala 1',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  nome: string;

  @ApiProperty({
    description: 'Endereço MAC da impressora',
    example: '00:1A:79:XX:XX:XX',
  })
  @Column({ type: 'varchar', length: 17, unique: true })
  macAddress: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;
}
