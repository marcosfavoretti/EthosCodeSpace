import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { AppRouteRepository } from "../infra/repository/AppRoute.repository";
import { User } from "../../user/@core/entities/User.entity";
import { ResAppRouteAppDTO } from "@app/modules/contracts/dto/ResAppRoute.dto";
import { CargoEnum } from "../../user/@core/enum/CARGOS.enum";
import { AppRoute } from "../@core/entities/AppRoute.entity";

@Injectable()
export class ConsultaRotasDoUsuarioUsecase {
    constructor(private readonly appRouteRepository: AppRouteRepository) { }

    async execute(user: User): Promise<ResAppRouteAppDTO[]> {
        try {
            const cargos = user.cargosLista;
            Logger.log(cargos)
            const routes = await this.appRouteRepository.find();
            //filtra as rotas que o array cargos contem os algum cargo que o usaurio tem
            const filteredRoutes = routes.filter(route =>
                route.cargos.some(cargo => cargos.includes(cargo as CargoEnum))
            );
            //merge para nao ter rotas duplicadas
            const resolvedRoutes = this.resolverSubRoutes(filteredRoutes);
            console.log(resolvedRoutes)
            return resolvedRoutes.map(route => ResAppRouteAppDTO.fromEntity(route));
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Erro ao consultar rotas do usuário', error);
        }
    }

    private resolverSubRoutes(routes: AppRoute[]): AppRoute[] {
        const rotasConsolidadas = routes.reduce((acc, current) => {
            const rotaExistente = acc[current.route];
            if (rotaExistente) {
                const todasSubRotas = [...rotaExistente.subRoutes, ...current.subRoutes];
                rotaExistente.subRoutes = Array.from(
                    new Map(todasSubRotas.map(s => [s.route, s])).values()
                );
            } else {
                acc[current.route] = { ...current };
            }
            return acc;
        }, {} as Record<string, AppRoute>);
        return Object.values(rotasConsolidadas);
    }

}