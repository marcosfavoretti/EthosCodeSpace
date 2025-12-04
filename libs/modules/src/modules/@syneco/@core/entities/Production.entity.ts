import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductionData } from './ProductionData.entity';
import { TypeData } from '../enum/TypeData.enum';
// import { IdentifiersPlates } from "src/module/plates/@core/entities/IdetifiersPlates.entity";
import { PartName } from './embedded/PartName.entity';

@Entity({ name: 'Production' })
export class Production {
  @PrimaryGeneratedColumn('increment')
  public ProductionID: number;
  @Column('varchar')
  public OrderNum: string;
  @Column('varchar')
  public PartCode: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value: PartName) => value.data,
      from: (value: string) => {
        return new PartName(value);
      },
    },
  })
  public PartName: PartName;

  @Column('int')
  public PlanQty: number;

  @Column('datetime')
  public PlannedEndTimestamp: Date;

  @OneToMany(() => ProductionData, (prodData) => prodData.production, {
    cascade: ['update'],
    eager: true,
  })
  public productionData: ProductionData[];

  // @OneToMany(() => IdentifiersPlates, (plate) => plate.production, { cascade: ['insert', 'update'] })
  // public Identifiersplates: IdentifiersPlates[];

  getPedido(): ProductionData | undefined {
    return this.productionData.find((p) => p.TypeDataID === TypeData.PEDIDO);
  }
  getPrefixo(): ProductionData | undefined {
    return this.productionData.find((p) => p.TypeDataID === TypeData.PREFIXO);
  }
  getItemCliente(): ProductionData | undefined {
    return this.productionData.find(
      (p) => p.TypeDataID === TypeData.ITEM_CLIENTE,
    );
  }
  getTipagemStatus(): ProductionData | undefined {
    return this.productionData.find(
      (p) => p.TypeDataID === TypeData.TIPAGEM_STT,
    );
  }
  getCliente(): ProductionData | undefined {
    return this.productionData.find((p) => p.TypeDataID === TypeData.CLIENTE);
  }
  getPedidoCli(): ProductionData | undefined {
    return this.productionData.find(
      (p) => p.TypeDataID === TypeData.PEDIDO_CLI,
    );
  }
  concatPrefix(prefix: string, typedata: TypeData): ProductionData {
    const productiondata = this.productionData?.find(
      (p) => p.TypeDataID === typedata,
    );
    if (productiondata) {
      productiondata.Value = productiondata.Value.concat(`,${prefix}`).trim();
      return productiondata;
    }
    throw new Error('id da productionData esta invalido');
  }
}
