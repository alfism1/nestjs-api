import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  // inject the AppService into the AppController
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    // call the AppService's getHello method
    return this.appService.getHello();
  }
}
