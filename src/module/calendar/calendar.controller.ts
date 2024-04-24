import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/utils/decorator/auth.decorator';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Public()
  @Get('weekends/:year')
  async getWeekends(@Param('year') year: string) {
    if (!year) return null;
    return this.calendarService.findWeekends(year);
  }
}
