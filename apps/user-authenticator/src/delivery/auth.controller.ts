import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserUsecase } from '@app/modules/modules/user/application/CreateUser.usecase';
import { LoginUserUsecase } from '@app/modules/modules/user/application/LoginUser.usecase';
import { DetailUserUsecase } from '@app/modules/modules/user/application/DetailUser.usecase';
import { CheckUserTokenUsecase } from '@app/modules/modules/user/application/CheckUserToken.usecase';
import { CreateUserDto } from '@app/modules/contracts/dto/CreateUser.dto';
import { AuthDto } from '@app/modules/contracts/dto/Auth.dto';
import { UserResponseDTO } from '@app/modules/contracts/dto/ResUser.dto';
import type { Response } from 'express';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import type { CustomRequest } from '@app/modules/shared/types/AppRequest.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ValidaCriacaoUsuarioUseCase } from '@app/modules/modules/user/application/ValidaCriacaoUsuario.usecase';

@ApiTags('Authentication')
@Controller('')
export class AuthController {
  constructor(
    @Inject(CreateUserUsecase) private createUserUsecase: CreateUserUsecase,
    @Inject(LoginUserUsecase) private loginUserUsecase: LoginUserUsecase,
    @Inject(DetailUserUsecase) private detailUserUsecase: DetailUserUsecase,
    @Inject(CheckUserTokenUsecase)
    private checkUserTokenUsecase: CheckUserTokenUsecase,
    @Inject(ValidaCriacaoUsuarioUseCase)
    private validaCriacaoUsuarioUseCase: ValidaCriacaoUsuarioUseCase,
  ) {}

  /**
   * @param createUserDto
   * @returns
   * @description rota para criacao de usuario
   */
  @UseGuards(ThrottlerGuard)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: UserResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid user data',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.createUserUsecase.execute(createUserDto);
  }

  /**endpoint para validacao de usuario que retorna um html para ser renderizado*/
  @Get('validate-user/:token')
  @Render('user-validation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate user creation with a token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully validated and created',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Validation token not found',
  })
  async validateUser(@Param('token') token: string) {
    return await this.validaCriacaoUsuarioUseCase.execute({
      token,
    });
  }

  /**
   * @param authDto
   * @param response
   * @returns
   * @description rota para autenticacao do usuario
   */
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and get JWT' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
    schema: { example: { token: 'jwt_token_here' } },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.loginUserUsecase.login(authDto);
    response.cookie('access_token', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { token: jwt };
  }

  /**endpoint de logout */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user by clearing JWT cookie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged out',
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }

  /**detalha o usuario com base no token */
  @Get('detail')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get authenticated user details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User details',
    type: UserResponseDTO,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async detail(@Req() request: CustomRequest): Promise<UserResponseDTO> {
    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('User not found in token');
    }
    return this.detailUserUsecase.execute(userId);
  }

  /**
   * @param token
   * @returns
   * @description valida se o token é valido ou nao
   */
  @Post('check-token')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check JWT validity' })
  @ApiBody({
    schema: { type: 'object', properties: { token: { type: 'string' } } },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token validity',
    schema: { example: { isValid: true } },
  })
  async checkToken(@Req() req: CustomRequest) {
    const isValid = this.checkUserTokenUsecase.execute(
      req.cookies.access_token,
    );
    return { isValid };
  }
}
