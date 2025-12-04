import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
  constructor() {
    super('credenciais incorretas');
  }
}
