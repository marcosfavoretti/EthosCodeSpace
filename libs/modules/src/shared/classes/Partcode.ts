import { BadRequestException } from '@nestjs/common';

export class Partcode {
  public constructor(private partcode: string) {
    partcode = partcode.trim();
    const pattern = /^\d{1,2}-\d{3}-[A-Za-z]?\d{3,6}[A-Za-z]{0,2}\d{0,2}$/;
    if (!pattern.test(partcode))
      throw new BadRequestException(
        `o valor de partcode é invalido ${partcode}`,
      );
    this.partcode = partcode;
  }
  public getPartcodeNum(): string {
    return this.partcode;
  }
}
