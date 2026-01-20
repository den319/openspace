import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { GlobalExceptionFilter } from './common/global-exception.filter'
import { LoggingService } from './common/logging/logging.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  process.env.NODE_ENV !== 'production' && app.enableCors()

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(LoggingService)))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Openspace | Dharmik Vora')
    .setDescription(
      `The Openspace API.
        <h2>Looking for the graphql api?</h2>
        Go to <a href="/graphql" target="_blank">/graphql</a> to test queries on playground.
      `,
    )
    .setVersion('0.1')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api', app, document)

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')

  console.log('Listning on port:', process.env.PORT ?? 3000)
}
bootstrap()
