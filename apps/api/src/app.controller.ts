import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('favicon.ico')
  @HttpCode(HttpStatus.NO_CONTENT)
  getFavicon() {
    // Return 204 No Content to indicate no favicon but successful request
    // This prevents 404 errors and subsequent logging
    return
  }
}
