import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { JwtHandler } from "../infra/service/JwtHandler";
import { IUserService } from "../@core/interfaces/IUserService";
import { AuthDto } from "@app/modules/contracts/dto/Auth.dto";
import { User } from "../@core/entities/User.entity";

@Injectable()
export class LoginUserUsecase {
    private jwtGen: JwtHandler = new JwtHandler();

    constructor(
        @Inject(IUserService) private userService: IUserService,
    ) { }

    async login(dto: AuthDto): Promise<string> {
        try {
            const user = await this.userService.auth(dto);
            const user2jwt = plainToInstance(User, user, { excludeExtraneousValues: true });
            return this.jwtGen.generateToken(user2jwt);
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new InternalServerErrorException("problemas ao efetuar o login", error.message);
        }
    }

    async loginAsGuest(dto: { name: string }): Promise<User> {
        return await this.userService.guestAutentication(dto.name);
    }
}