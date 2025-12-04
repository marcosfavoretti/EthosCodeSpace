import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as date_fns from 'date-fns';
import { ItemEstrutura } from '../../@core/classes/ItemEstrutura';

export class EstruturaOracleDAO {
  constructor(@InjectDataSource('logix') private connection: DataSource) {}

  async getChildren(itemPai: string): Promise<ItemEstrutura[]> {
    const data_hj = date_fns.format(new Date(), 'dd/MM/yyyy');
    const queryChildren = `      
            SELECT 
            a.COD_ITEM_COMPON as "partcode", 
            a.qtd_necessaria as "qtd", 
            d.den_item_reduz as "itemCliente, 
            d.ies_tip_item as "status"
            FROM 
            estrut_grade a 
            JOIN 
            item d ON a.cod_item_compon = d.cod_item  
            WHERE 
            a.cod_item_pai = '${itemPai}'
            AND ((a.dat_validade_ini IS NULL  AND a.dat_validade_fim IS NULL) OR
            (a.dat_validade_ini IS NULL  AND a.dat_validade_fim >= '${data_hj}') OR  
            (a.dat_validade_fim IS NULL  AND a.dat_validade_ini <= '${data_hj}') OR
            ('${data_hj}' BETWEEN a.dat_validade_ini AND a.dat_validade_fim))
          `;
    const consult_data =
      await this.connection.query<ItemEstrutura[]>(queryChildren);
    return consult_data;
  }

  async getCodItemCliente(partcode: string): Promise<string> {
    const result = await this.connection.query<{ DEN_ITEM_REDUZ: string }[]>(`
            SELECT den_item_reduz FROM ITEM where cod_item = '${partcode}'    
        `);
    return result[0]?.DEN_ITEM_REDUZ ?? 'NONE';
  }

  async getItemStatus(partcode: string): Promise<string | undefined> {
    const result = await this.connection.query<{ IES_TIP_ITEM: string }[]>(`
            SELECT ies_tip_item FROM ITEM where cod_item = '${partcode}'    
        `);
    return result[0]?.IES_TIP_ITEM ?? 'F';
  }
}
