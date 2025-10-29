import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Inject, Post, Req, Res, UseGuards, } from '@nestjs/common';
import { CreateUserUsecase } from '@app/modules/modules/user/application/CreateUser.usecase';
import { LoginUserUsecase } from '@app/modules/modules/user/application/LoginUser.usecase';
import { DetailUserUsecase } from '@app/modules/modules/user/application/DetailUser.usecase';
import { CheckUserTokenUsecase } from '@app/modules/modules/user/application/CheckUserToken.usecase';
import { CreateUserDto } from '@app/modules/contracts/dto/CreateUser.dto';
import { AuthDto } from '@app/modules/contracts/dto/Auth.dto';
import { UserResponseDTO } from '@app/modules/contracts/dto/UserResponse.dto';
import type { Request, Response } from 'express';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import type { CustomRequest } from '@app/modules/shared/types/AppRequest.type';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(CreateUserUsecase) private createUserUsecase: CreateUserUsecase,
        @Inject(LoginUserUsecase) private loginUserUsecase: LoginUserUsecase,
        @Inject(DetailUserUsecase) private detailUserUsecase: DetailUserUsecase,
        @Inject(CheckUserTokenUsecase) private checkUserTokenUsecase: CheckUserTokenUsecase,
    ) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered', type: UserResponseDTO })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid user data' })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.createUserUsecase.execute(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user and get JWT' })
    @ApiBody({ type: AuthDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'User successfully authenticated', schema: { example: { token: 'jwt_token_here' } } })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authDto: AuthDto, @Res({ passthrough: true }) response: Response) {
        const jwt = await this.loginUserUsecase.login(authDto);
        response.cookie('access_token', jwt, {
            httpOnly: true,
            sameSite: 'lax'
        });
        return { token: jwt };
    }

    @Get('me')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get authenticated user details' })
    @ApiResponse({ status: HttpStatus.OK, description: 'User details', type: UserResponseDTO })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
    async getMe(@Req() request: CustomRequest): Promise<UserResponseDTO> {
        const userId = request.user?.id;
        if (!userId) {
            throw new ForbiddenException('User not found in token');
        }
        return this.detailUserUsecase.execute(userId);
    }

    @Post('check-token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Check JWT validity' })
    @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string' } } } })
    @ApiResponse({ status: HttpStatus.OK, description: 'Token validity', schema: { example: { isValid: true } } })
    async checkToken(@Body('token') token: string) {
        const isValid = this.checkUserTokenUsecase.execute(token);
        return { isValid };
    }
}
