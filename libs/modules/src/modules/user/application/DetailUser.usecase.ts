import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserNotFoundException } from "../@core/exceptions/UserNotFound.exception";
import { IUserService } from "../@core/interfaces/IUserService";
import { UserResponseDTO } from "@app/modules/contracts/dto/UserResponse.dto";

@Injectable()
export class DetailUserUsecase {
    constructor(
        @Inject(IUserService) private userService: IUserService,
    ) { }

    async execute(userId: string): Promise<UserResponseDTO> {
        try {
            const targetUser = await this.userService.getUser(userId);
            return UserResponseDTO.fromEntity(targetUser);
        }
        catch (err) {
            if (err instanceof UserNotFoundException) throw err;
            throw new InternalServerErrorException(err);
        }
    }
}