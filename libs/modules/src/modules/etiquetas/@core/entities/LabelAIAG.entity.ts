import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { getDayOfYear, getYear } from 'date-fns';
import { CheckSum } from 'src/modules/shared/@core/classes/CheckSum';

@Entity({
  name: 'LabelAIAG',
})
export class LabelAIAG {
  @PrimaryGeneratedColumn('increment')
  idLabelAIAG: number;
  @CreateDateColumn()
  severtime: string; // Considere usar 'Date' aqui para consistência
  @Column('varchar')
  yearYY: string;
  @Column('varchar')
  dateJulian: string;
  @Column('varchar')
  sequence: string;
  @Column('varchar')
  checkSum: string;
  @Column('varchar')
  partnumber: string;
  @Column('varchar')
  revision: string;
  @Column('varchar')
  supplierIdentifier: string;

  // Método estático para criar uma nova instância de LabelAIAG
  static create(
    partnumber: string,
    revision: string,
    supplierIdentifier: string,
    date: Date,
    sequence: number,
  ): LabelAIAG {
    const label = new LabelAIAG(); // Cria uma instância vazia
    label.partnumber = partnumber;
    label.revision = revision;
    label.supplierIdentifier = supplierIdentifier;
    label.yearYY = getYear(date).toString().substring(2);
    label.dateJulian = getDayOfYear(date).toString();
    label.sequence = sequence.toString().padStart(4, '0');
    label.checkSum = CheckSum.calcCRC8(label.dataMatrixNoCheckSum()); // Usa o método da instância
    return label;
  }

  dataMatrixNoCheckSum(): string {
    return `${this.partnumber || ''}-${this.revision || ''}-${this.supplierIdentifier || ''}-${this.yearYY || ''}${this.dateJulian || ''}${this.sequence || ''}`;
  }

  dataMatrix(): string {
    return `${this.partnumber || ''}-${this.revision || ''}-${this.supplierIdentifier || ''}-${this.yearYY || ''}${this.dateJulian || ''}${this.sequence || ''}${this.checkSum || ''}`;
  }
}
