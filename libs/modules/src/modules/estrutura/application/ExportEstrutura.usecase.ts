import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConsultaPorPartcodeReqDTO } from '@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto';
import { LoadEstruturaOracleService } from '../infra/service/LoadEstruturaOracle.service';
import { CommitInNeo4jService } from '../infra/service/CommitInNeo4j.service';
import { EstruturaNeo4jDAO } from '../infra/dao/EstruturaNeo4j.dao';

@Injectable()
export class ExportEstruturaUsecase {
  constructor(
    @Inject(EstruturaNeo4jDAO) private estruturaRepository: EstruturaNeo4jDAO,
    @Inject(LoadEstruturaOracleService)
    private loaderService: LoadEstruturaOracleService,
    @Inject(CommitInNeo4jService) private commitService: CommitInNeo4jService,
  ) {}

  async export(partcode: ConsultaPorPartcodeReqDTO): Promise<EstruturaDto> {
    try {
      const estruturaExistente =
        await this.estruturaRepository.getEstrutura(partcode);
      if (estruturaExistente)
        await this.estruturaRepository.deleteEstrutura(partcode);

      console.time('relational search');
      const tree = await this.loaderService.generate(partcode);
      console.timeEnd('relational search');

      if (!tree.getChildren().length)
        throw new BadRequestException('hierarquia com problema');
      if (tree.getStatus() !== 'F')
        throw new BadRequestException('Estrutura nao é um item final');

      await this.commitService.transfer(tree);

      console.time('neo4j search');
      const result = await this.estruturaRepository.getEstrutura(partcode);
      console.timeEnd('neo4j search');

      if (!result)
        throw new BadRequestException(
          'a estrutura nao foi salva no banco de dados',
        );
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`Erro ao exportar estrutura \n ${error}`);
    }
  }
}
