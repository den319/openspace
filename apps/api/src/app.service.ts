import { Injectable } from '@nestjs/common'
// import { add } from '@openspace/sample-lib'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
