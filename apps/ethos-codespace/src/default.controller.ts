import { AuthDto } from "@app/modules/contracts/dto/Auth.dto";
import { CreateUserDto } from "@app/modules/contracts/dto/CreateUser.dto";
import { User } from "@app/modules/modules/user/@core/entities/User.entity";
import { JwtGuard } from "@app/modules/shared/guards/jwt.guard";
import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import type { Response } from "express";
import { CreateUserUsecase } from "@app/modules/modules/user/application/CreateUser.usecase";
import { LoginUserUsecase } from "@app/modules/modules/user/application/LoginUser.usecase";
import { CheckUserTokenUsecase } from "@app/modules/modules/user/application/CheckUserToken.usecase";

@Controller('/central')
export class DefaultController {
    
    constructor(
        @Inject(CreateUserUsecase) private createUserUsecase: CreateUserUsecase,
        @Inject(LoginUserUsecase) private loginUserUsecase: LoginUserUsecase,
        @Inject(CheckUserTokenUsecase) private checkUserTokenUsecase: CheckUserTokenUsecase
    ) { }

    @Post('/')
    @ApiResponse({
        status: HttpStatus.OK,
        type: () => User,
    })
    public async createUserMethod(@Body() payload: CreateUserDto) {
        return this.createUserUsecase.execute(payload);
    }

    @Post('/ping')
    @ApiBearerAuth('XYZ')
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'No content',
    })
    public async checkUserAuth() {
        // The JwtGuard will handle token validation, no direct call to checkUserTokenUsecase needed here
        return;
    }

    @Post('/auth')
    @ApiResponse({
        status: 200,
        description: 'User successfully authenticated',
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
    })
    @HttpCode(HttpStatus.OK)
    public async loginMethod(@Body() payload: AuthDto, @Res({ passthrough: true }) response: Response) {
        const jwt = await this.loginUserUsecase.login(payload);
        response.cookie('access_token', jwt, {
            httpOnly: true,
            sameSite: 'lax'
        });
        return { token: jwt };
    }
}