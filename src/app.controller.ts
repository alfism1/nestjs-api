import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // inject the AppService into the AppController
  constructor(private readonly appService: AppService) {}

  @Get('test')
  getHello(): string {
    // call the AppService's getHello method
    return this.appService.getHello();
  }
}
