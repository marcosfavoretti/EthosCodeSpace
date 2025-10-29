import { Partcode } from "@app/modules/shared/classes/Partcode";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class ConsultaPorPartcodeReqDTO {
    @IsString()
    @Transform(({ value }) => new Partcode(value))
    @ApiProperty({
        description: 'O partcode do item',
        example: '20-000-00220',
        type: String 
    })
    partcode: Partcode;
}