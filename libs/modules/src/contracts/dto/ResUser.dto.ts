import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../modules/user/@core/entities/User.entity';

export class UserResponseDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty({
      type: String,
      isArray: true
  })
  cargosLista: string[];

  static fromEntity(user: User): UserResponseDTO {
    const userResponseDto = new UserResponseDTO();
    userResponseDto.avatar = user.avatar;
    userResponseDto.email = user.email;
    userResponseDto.name = user.name;
    userResponseDto.id = user.id;
    userResponseDto.cargosLista = user.cargosLista;
    return userResponseDto;
  }
}
