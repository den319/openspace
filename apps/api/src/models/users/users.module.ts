import { Module } from '@nestjs/common'
import { UsersService } from './graphql/users.service'
import { UsersResolver } from './graphql/users.resolver'
import { UsersController } from './rest/users.controller'
import { CaptchaService } from 'src/common/captcha.service'
import { IpBlockingService } from 'src/common/ip-blocking.service'
import { LoggingService } from 'src/common/logging/logging.service'

@Module({
  providers: [
    UsersResolver,
    UsersService,
    CaptchaService,
    IpBlockingService,
    LoggingService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
