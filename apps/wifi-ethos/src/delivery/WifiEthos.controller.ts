import { ConsultaPorIdDto } from "@app/modules/contracts/dto/ConsultaPorId.dto";
import { GerarCodigoWifiDTO } from "@app/modules/contracts/dto/GerarCodigoWifi.dto";
import { SolicitarCodigoWifiDTO } from "@app/modules/contracts/dto/SolicitarCodigoWifi.dto";
import { CheckarMagicLinkUseCase } from "@app/modules/modules/wifiEthos/application/CheckarMagicLink.usecase";
import { GerarCodigoWifiUseCase } from "@app/modules/modules/wifiEthos/application/GerarCodigoWifi.usecase";
import { SolicitarCodigoWifiUseCase } from "@app/modules/modules/wifiEthos/application/SolicitarCodigoWifi.usecase";
import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

@Controller('/')
export class WifiEthosController {
    @Inject(SolicitarCodigoWifiUseCase)
    private solicitarCodigoWifiUseCase: SolicitarCodigoWifiUseCase;
    @ApiResponse({
        type: String
    })
    @HttpCode(HttpStatus.OK)
    @Post('/new')
    async solicitarCodigoWifi(
        @Body() dto: SolicitarCodigoWifiDTO
    ): Promise<string> {
        return this.solicitarCodigoWifiUseCase.execute(dto);
    }

    @Inject(GerarCodigoWifiUseCase)
    private gerarCodigoWifiUseCase: GerarCodigoWifiUseCase;
    @ApiResponse({
        type: String
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('/code/:id')
    async gerarCodigoWifiMethod(
        @Body() dto: GerarCodigoWifiDTO,
        @Param('id') id: string
    ): Promise<string> {
        return this.gerarCodigoWifiUseCase.execute({ ...dto, id });
    }

    @Inject(CheckarMagicLinkUseCase)
    private checkarMagicLinkUseCase: CheckarMagicLinkUseCase;
    @ApiResponse({
        type: Boolean
    })
    @HttpCode(HttpStatus.OK)
    @Post('/check/:id')
    async checkarMagicLinkMethod(
        @Param('id') id: string
    ): Promise<boolean> {
        return this.checkarMagicLinkUseCase.execute({ id });
    }

}