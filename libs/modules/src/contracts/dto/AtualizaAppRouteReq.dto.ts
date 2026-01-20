
import { PartialType } from '@nestjs/swagger';
import { CriaAppRouteReqDto } from './CriaAppRouteReq.dto';

export class AtualizaAppRouteReqDTO extends PartialType(CriaAppRouteReqDto) {}
