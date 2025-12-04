import { Inject, NotFoundException } from '@nestjs/common';
import { SetoresRepository } from '../repository/Setores.repository';
import { MercadosIntermediarioRepository } from '../repository/MercadosIntermediario.repository';
import { MercadosIntermediario } from '../../@core/entities/MercadosIntermediarios.entity';
import { EntityNotFoundError } from 'typeorm';

export class ConsultaMercadoService {
  constructor(
    @Inject(SetoresRepository) private setoresRepository: SetoresRepository,
    @Inject(MercadosIntermediarioRepository)
    private mercadoIntermediarioRepo: MercadosIntermediarioRepository,
  ) {}

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
      const mercados = await this.setoresRepository.find({
        where: {
          mercadosIntermediarios: {
            histBuffer: {
              serverTime: dia,
            },
          },
          idSetor: idSetor,
        },
        relations: {
          mercadosIntermediarios: {
            histBuffer: {
              item: true,
            },
          },
        },
      });
      return mercados.flatMap((s) => s.mercadosIntermediarios);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          `O setor não foi achado com id ${idSetor} nao foi achado}`,
        );
      }
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
