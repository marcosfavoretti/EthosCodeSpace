import { Inject } from '@nestjs/common';
import { SetoresRepository } from '../repository/Setores.repository';
import { MercadosIntermediarioRepository } from '../repository/MercadosIntermediario.repository';
import { MercadosIntermediario } from '../../@core/entities/MercadosIntermediarios.entity';

export class ConsultaMercadoService {
  constructor(
    @Inject(SetoresRepository)
    private setoresRepository: SetoresRepository,
    @Inject(MercadosIntermediarioRepository)
    private mercadoIntermediarioRepo: MercadosIntermediarioRepository,
  ) { }

  async consultarMercadosExistentes(): Promise<MercadosIntermediario[]> {
    try {
      return await this.mercadoIntermediarioRepo.find();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consultarMercadosExistentesNoSetor(
    idsetor: number,
  ): Promise<MercadosIntermediario[]> {
    try {
      return await this.mercadoIntermediarioRepo.find({
        where: {
          setor: {
            idSetor: idsetor,
          },
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consultarMercadosDoSetor(
    idSetor: number,
    dia: Date,
  ): Promise<MercadosIntermediario[]> {
    try {
      return await this.mercadoIntermediarioRepo
        .createQueryBuilder('mercado')
        .innerJoin('mercado.setor', 'setor', 'setor.idSetor = :idSetor', {
          idSetor,
        })
        .innerJoinAndSelect(
          'mercado.histBuffer',
          'buffer',
          'buffer.serverTime = :dia',
          { dia },
        )
        .leftJoinAndSelect('buffer.item', 'item')
        .getMany();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async cosultarMercados(dia: Date): Promise<MercadosIntermediario[]> {
    try {
      const setores = await this.setoresRepository.find({
        where: {
          mercadosIntermediarios: {
            histBuffer: {
              serverTime: dia,
            },
          },
        },
        relations: {
          mercadosIntermediarios: {
            histBuffer: {
              item: true,
            },
          },
        },
      });
      return setores.flatMap((i) => i.mercadosIntermediarios);
    } catch (error) {
      throw error;
    }
  }
}