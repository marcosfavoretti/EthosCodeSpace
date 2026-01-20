import { Inject, InternalServerErrorException } from '@nestjs/common';
import { FuncinarioRepository } from '../infra/repository/Funcionario.repository';
import { ResPontoFuncionarioDTO } from '@app/modules/contracts/dto/ResPontoFuncionario.dto';
import { FindManyOptions, Not, Raw } from 'typeorm';
import { ConsultaFuncionariosDTO } from '@app/modules/contracts/dto/ConsultaFuncionarios.dto';
import { ResponsePaginatorDTO } from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { Funcionario } from '../@core/entities/Funcionarios.entity';
import { set } from 'date-fns';

export class ConsultaFuncionariosUseCase {
  constructor(
    @Inject(FuncinarioRepository)
    private funcionarioRepository: FuncinarioRepository,
  ) {}

  async consulta(
    payload: ConsultaFuncionariosDTO,
  ): Promise<ResponsePaginatorDTO<ResPontoFuncionarioDTO>> {
    try {
      const {
        RA_CC,
        CPF,
        matricula,
        PIS,
        nome,
        page = 1,
        limit = 10,
      } = payload;

      const skip = (page - 1) * limit;

      const where: FindManyOptions<Funcionario>['where'] = {
        demitido: Not('D'),
      };

      if (RA_CC) {
        //testar
        where.centroDeCusto = Raw(
          (alias) => `TRIM(${alias}) = TRIM('${RA_CC}')`,
        );
      }
      if (nome) {
        where.nome = Raw(
          (alias) => `UPPER(TRIM(${alias})) LIKE UPPER('%${nome}%')`,
        );
      }

      const [funcionarios, total] =
        await this.funcionarioRepository.findAndCount({
          where,
          skip,
          take: limit,
        });

      const data = funcionarios.map((func) => ({
        matricula: func.matricula.trim(),
        nome: func.nome.trim(),
        setor: func.centroDeCusto.descricao.trim(),
      }));

      return new ResponsePaginatorDTO(data, total, page, limit);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'falha ao consultar os funcionarios',
      );
    }
  }
}
