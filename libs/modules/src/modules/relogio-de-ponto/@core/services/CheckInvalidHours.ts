import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckInvalidHours {
  private validHoursDiff: number;
  constructor(private configService: ConfigService) {
    this.validHoursDiff = this.configService.get<number>('HOURS_PER_DAY')!;
    Logger.debug(
      `HORAS TRABALHADAS POR DIA ${this.validHoursDiff}`,
      CheckInvalidHours.name,
    );
  }

  checkInvalidHours(props: { workedhours: number }): number {
    return Math.max(props.workedhours - this.validHoursDiff, 0);
  }
}
