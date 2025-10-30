import { ApiProperty } from "@nestjs/swagger";

export class GerarNotaResDTO{
    @ApiProperty()
    fileName?: string;
    @ApiProperty()
    content: Buffer;
    @ApiProperty()
    mimeType: string;
}