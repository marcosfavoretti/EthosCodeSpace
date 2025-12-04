import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ConsultaPorIdDto {
    @ApiProperty({
        description: 'classe de consulta generica por ID.',
    })
    @IsString()
    id: string;
}