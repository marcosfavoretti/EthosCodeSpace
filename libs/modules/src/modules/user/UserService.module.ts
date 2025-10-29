import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IUserService } from "./@core/interfaces/IUserService";
import { User } from "./@core/entities/User.entity";
import { UserService } from "./infra/service/User.service";

@Module({
    imports: [
        TypeOrmModule
            .forFeature([
                User
            ]),
    ],
    providers: [
        {
            provide: IUserService,
            useClass: UserService
        }
    ],
    exports: [
        IUserService
    ]
})
export class UserServiceModule { }