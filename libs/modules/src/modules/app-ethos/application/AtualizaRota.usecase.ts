
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRouteRepository } from '../infra/repository/AppRoute.repository';
import { AtualizaAppRouteReqDTO } from '@app/modules/contracts/dto/AtualizaAppRouteReq.dto';
import { ResAppRouteAppDTO } from '@app/modules/contracts/dto/ResAppRoute.dto';
import { ConsultaPorIdDto } from '@app/modules/contracts/dto/ConsultaPorId.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class AtualizaRotaUseCase {
    constructor(
        @InjectRepository(AppRouteRepository)
        private readonly appRouteRepository: AppRouteRepository,
    ) { }

    async execute(input: {id: ConsultaPorIdDto, data: AtualizaAppRouteReqDTO}): Promise<ResAppRouteAppDTO> {
        const { id } = input.id;
        const {...updateData} = input.data;
        
        const route = await this.appRouteRepository.findOne({ where: { _id: new ObjectId(id)} });

        if (!route) {
            throw new NotFoundException(`Rota com id ${id} não encontrada`);
        }

        Object.assign(route, updateData);
        const updatedRoute = await this.appRouteRepository.save(route);
        return ResAppRouteAppDTO.fromEntity(updatedRoute);
    }
}
