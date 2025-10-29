import { Module } from "@nestjs/common";
import { UserServiceModule } from "./UserService.module";
import { CargosServiceModule } from "./CargoService.module";
import { CreateUserUsecase } from "./application/CreateUser.usecase";
import { DetailUserUsecase } from "./application/DetailUser.usecase";
import { LoginUserUsecase } from "./application/LoginUser.usecase";
import { CheckUserTokenUsecase } from "./application/CheckUserToken.usecase";

@Module({
    imports: [
        UserServiceModule,
        CargosServiceModule
    ],
    providers: [
        CreateUserUsecase,
        DetailUserUsecase,
        LoginUserUsecase,
        CheckUserTokenUsecase
    ],
    exports: [
        CreateUserUsecase,
        DetailUserUsecase,
        LoginUserUsecase,
        CheckUserTokenUsecase
    ],
})
export class UserModule { }