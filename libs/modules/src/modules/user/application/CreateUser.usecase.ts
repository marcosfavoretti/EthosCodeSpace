import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserBuilder } from "../@core/builder/User.builder";
import { User } from "../@core/entities/User.entity";
import { IUserService } from "../@core/interfaces/IUserService";
import { ISetUserCargo } from "../@core/interfaces/ISetUserCargo";
import { CreateUserDto } from "@app/modules/contracts/dto/CreateUser.dto";
import { CargoEnum } from "../@core/enum/CARGOS.enum";

@Injectable()
export class CreateUserUsecase {
    constructor(
        @Inject(IUserService) private userService: IUserService,
        @Inject(ISetUserCargo) private setUserCargoService: ISetUserCargo
    ) { }

    async execute(dto: CreateUserDto): Promise<User> {
        try {
            const user = new UserBuilder()
                .withPassword(dto.password)
                .withEmail(dto.email)
                .withName(dto.name)
                .build();
            if (await this.userService.validUser(user)) {
                const finalUser = await this.userService.saveUser(user);
                await this.setUserCargoService.setUserCargo(finalUser, CargoEnum.USER);
                return finalUser;
            }
            throw new Error('usuario inválido, nome ou email já existe');
        } catch (error) {
            throw new BadRequestException('não foi possivel criar usuario!', error.message);
        }
    }
}