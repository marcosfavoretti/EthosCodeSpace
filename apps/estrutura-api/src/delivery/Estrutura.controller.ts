import { ConsultaPorPartcodeReqDTO } from '@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto';
import { ResEstruturaDependentesDTO } from '@app/modules/contracts/dto/ResEstruturaDependentes.dto';
import { ResEstruturaItemDTO } from '@app/modules/contracts/dto/ResEstruturaItem.dto';
import { ResEstruturaListaDTO } from '@app/modules/contracts/dto/ResEstruturaLista.dto';
import { ResEstruturaTreeDTO } from '@app/modules/contracts/dto/ResEstruturaTree.dto';
import { ConsultaItensDeControleUsecase } from '@app/modules/modules/estrutura/application/ConsultaItensDeControleUsecase';
import { GetEstruturaListaPorPartcodeUsecase } from '@app/modules/modules/estrutura/application/GetEstruturaListaPorPartcode.usecase';
import { GetEstruturasDependentesUsecase } from '@app/modules/modules/estrutura/application/GetEstruturasDependentes.usecase';
import { GetEstruturaTreePorPartcodeUsecase } from '@app/modules/modules/estrutura/application/GetEstruturaTreePorPartcode.usecase';
import { ListaEstruturasUsecase } from '@app/modules/modules/estrutura/application/ListaEstruturas.usecase';
import { RemoveEstruturaUsecase } from '@app/modules/modules/estrutura/application/RemoveEstrutura.usecase';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('itens')
export class EstruturaController {
  /**
   * lista estruturas finais
   */
  @Inject(ListaEstruturasUsecase) private listusecase: ListaEstruturasUsecase;
  @Get('/')
  @ApiOperation({
    summary: 'lista todos os itens finais de estrutura',
    description:
      'lista todos os itens finais de estrutura cadastrados no banco ate o momento',
  })
  @ApiResponse({
    type: ResEstruturaItemDTO,
    isArray: true,
    description: 'lista todos os itens finais',
    status: HttpStatus.OK,
  })
  public async listAllEstruturasFinaisMethod(): Promise<ResEstruturaItemDTO[]> {
    return await this.listusecase.listAll();
  }

  /**
   * consulta item de controle
   */
  @Inject(ConsultaItensDeControleUsecase)
  private consultaItemControle: ConsultaItensDeControleUsecase;
  @ApiOperation({
    summary: 'busca itens de controle na estrutura final',
  })
  @ApiResponse({
    type: ResEstruturaItemDTO,
    isArray: true,
  })
  @Get('/controle')
  public async getItemDeControle(
    @Query() dto: ConsultaPorPartcodeReqDTO,
  ): Promise<ResEstruturaItemDTO[]> {
    return await this.consultaItemControle.consulta(dto);
  }

  /**
   * lista as estruturas pais que utilizam do item
   */
  @Inject(GetEstruturasDependentesUsecase)
  private getEstruturasDependentesUsecase: GetEstruturasDependentesUsecase;
  @ApiResponse({
    type: ResEstruturaDependentesDTO,
    isArray: true,
  })
  @Get('dependentes')
  async getEstruturasDedendentesMethod(
    @Query() dto: ConsultaPorPartcodeReqDTO,
  ): Promise<ResEstruturaDependentesDTO> {
    return await this.getEstruturasDependentesUsecase.getdependentes(
      dto.partcode,
    );
  }

  /**
   * remove a estrutura do banco
   */
  @Inject(RemoveEstruturaUsecase)
  private removeEstrutura: RemoveEstruturaUsecase;
  @ApiOperation({
    summary: 'deleta a estrutura final selecionada',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  public async removeInNeo4j(
    @Query() payload: ConsultaPorPartcodeReqDTO,
  ): Promise<void> {
    await this.removeEstrutura.remove(payload.partcode);
  }

  /**
   * lista os componentes da estrutura
   */
  @Inject(GetEstruturaListaPorPartcodeUsecase)
  private getEstruturaListaPorPartcodeUsecase: GetEstruturaListaPorPartcodeUsecase;
  @Get('/list')
  @ApiOperation({
    summary: 'lista a estrutura como lista simples',
  })
  @ApiResponse({
    type: ResEstruturaListaDTO,
    isArray: true,
    status: HttpStatus.OK,
  })
  public async estrturaAsListMethod(
    @Query() dto: ConsultaPorPartcodeReqDTO,
  ): Promise<ResEstruturaListaDTO> {
    return await this.getEstruturaListaPorPartcodeUsecase.execute(dto.partcode);
  }

  /**
   * lista os componentes da estrutura como arquitetura
   */
  @Inject(GetEstruturaTreePorPartcodeUsecase)
  private getEstruturaTreePorPartcodeUsecase: GetEstruturaTreePorPartcodeUsecase;
  @Get('/tree')
  @ApiOperation({
    summary: 'lista a estrutura como hierarquia',
  })
  @ApiResponse({
    type: ResEstruturaTreeDTO,
    isArray: true,
    status: HttpStatus.OK,
  })
  public async estrturaAsTreeMethod(
    @Query() dto: ConsultaPorPartcodeReqDTO,
  ): Promise<ResEstruturaTreeDTO> {
    return await this.getEstruturaTreePorPartcodeUsecase.execute(dto.partcode);
  }
}
