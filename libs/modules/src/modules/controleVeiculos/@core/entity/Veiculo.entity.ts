import { Column, CreateDateColumn, Entity, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VeiculoEstado } from "../enum/VeiculoEstados";

@Entity({name: 'Veiculo'})
export class Veiculo {
  @ObjectIdColumn()
  id: string;

  @Column()
  placa: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  ano: number;

  @Column({ nullable: true })
  cor: string;

  @Column({ type: 'enum', enum: VeiculoEstado, nullable: false})
  status: VeiculoEstado;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}