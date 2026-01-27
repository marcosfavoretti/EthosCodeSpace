import { BadRequestException } from "@nestjs/common";

export class ExpireMagicLinkException extends BadRequestException{
    constructor(){
        super('Link expirado, gere outro');
    }
}