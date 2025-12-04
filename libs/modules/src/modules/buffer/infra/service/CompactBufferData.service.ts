import { FalhaAoCompactarDadoException } from '../../@core/exception/FalhaAoCompactarDado.exception';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CompactBuffer } from '../../@core/class/CompactBuffer';
import { format } from 'date-fns';

export class CompactBufferDataService {
  constructor(@InjectDataSource('syneco_database') private dt: DataSource) {}

  async compact(
    start: Date,
    end: Date,
  ): Promise<CompactBuffer & { serverTime: Date }[]> {
    try {
      return await this.dt.query(
        `
                SELECT DISTINCT
                BH000.serverTime,
                BH000.Item,
                BH000.tipo_item,
                TRE.Planilha,
                BH110.[CORREDOR DE SOLDA], BH110.[LIXA], BH110.[GATE SOLDA], BH110.[MERCADO BANHO],  BH110.[BANHO],
                BH110.[LINHA DE PINTURA], BH110.[PINTURA], BH000.[MONTAGEM], BH000.[LINHA DE MONTAGEM],
                BH000.[LIBERADA], BH000.[RETRABALHO S/ PORTA], BH000.[RETRABALHO MONTAGEM],
                BH000.[RETRABALHO SOLDA], BH000.[RETRABALHO PINTURA], BH000.[INSPEÇÃO]
                FROM vw_bufferhistorico BH000
                LEFT JOIN vw_bufferhist110 BH110
                ON BH000.ItemFilho = BH110.Item AND BH000.serverTime = BH110.serverTime
                LEFT JOIN Temp_excel_Relation TRE
                ON BH000.tipo_item = TRE.Apelido
                WHERE BH000.Montagem IS NOT NULL
                AND BH000.serverTime 
                BETWEEN @0 and @1
                ORDER BY BH000.serverTime, BH000.Item
                `,
        [
          format(start, 'yyyy-MM-dd HH:mm:ss'),
          format(end, 'yyyy-MM-dd HH:mm:ss'),
        ],
      );
    } catch (error) {
      console.error(error);
      throw new FalhaAoCompactarDadoException();
    }
  }
}
// const mercados = await this.consultaMercadoService.consultarMercadosExistentes();
// const mercadosStr = mercados.map(m => `[${m.nome}]`).join(', ');
// const itens: CompactBuffer[] = await this.dt.query<CompactBuffer[]>(`
//     SELECT
//     serverTime,
//     Item,
//     tipo_item,
//     ItemFilho
//     FROM (
//     SELECT
//     BH.serverTime,
//     BH.Item,
//     IQ.tipo_item,
//     IR.ItemFilho,
//     MI.nome,
//     BH.buffer
//     FROM buffer_historico BH
//     JOIN mercados_intermediario MI
//     ON BH.mercadoIdMercadosIntermediario = MI.idMercadosIntermediario
//     JOIN item_x_qtdsemana IQ ON BH.Item = IQ.Item
//     JOIN Pixie_ItemRelationshipv2 IR ON Bh.Item = IR.ItemPAI
//     WHERE BH.serverTime = CONVERT(date, GETDATE(), 103)
//     ) AS BH_Table
//     PIVOT (
//     MAX(buffer) FOR nome IN ([CORREDOR DE SOLDA], [LIXA], [GATE SOLDA], [MERCADO BANHO], [LINHA DE PINTURA], [PINTURA], [MONTAGEM], [LINHA DE MONTAGEM], [LIBERADA], [RETRABALHO S/ PORTA], [RETRABALHO MONTAGEM], [RETRABALHO SOLDA], [RETRABALHO PINTURA], [INSPEÇÃO], [BANHO])
//     ) AS Buffer_Historico_Pivot;
// `);
// console.log(itens)
// for(const item of itens){
//     for(const mercado of mercados){
//         const response = await this.bufferHistRepo.findOne({
//             where: {
//                 serverTime: new Date(),
//                 item: mercado.consulta === CONSULTA._000? item.item : item.ItemFiho,

//             }
//         })
//     }
// }
// return result;
