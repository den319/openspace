import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { PrismaModule } from './common/prisma/prisma.module'
import { UsersModule } from './models/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { AdminsModule } from './models/admins/admins.module'
import { CustomersModule } from './models/customers/customers.module'
import { ManagersModule } from './models/managers/managers.module'
import { ValetsModule } from './models/valets/valets.module'
import { GaragesModule } from './models/garages/garages.module'
import { AddressesModule } from './models/addresses/addresses.module'
import { SlotsModule } from './models/slots/slots.module'
import { BookingsModule } from './models/bookings/bookings.module'
import { ValetAssignmentsModule } from './models/valet-assignments/valet-assignments.module'
import { BookingTimelinesModule } from './models/booking-timelines/booking-timelines.module'
import { ReviewsModule } from './models/reviews/reviews.module'
import { VerificationsModule } from './models/verifications/verifications.module'
import { CompaniesModule } from './models/companies/companies.module'
import { CaptchaService } from './common/captcha.service'
import { IpBlockingService } from './common/ip-blocking.service'
import { LoggingService } from './common/logging/logging.service'
import { GlobalExceptionFilter } from './common/global-exception.filter'
import { LoggingModule } from './common/logging/logging.module'
import { StripeModule } from './models/stripe/stripe.module'

const MAX_AGE = 24 * 60 * 60
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/api/.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: MAX_AGE,
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
      fieldResolverEnhancers: ['guards'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // buildSchemaOptions: {
      //   numberScalarMode: 'integer',
      // },
      playground: false,
      // remove bellow when deploying on production
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
        }),
      ],
      // csrfPrevention: process.env.NODE_ENV === "production",
    }),

    LoggingModule,
    PrismaModule,
    UsersModule,
    AddressesModule,
    AdminsModule,
    CustomersModule,
    ManagersModule,
    ValetsModule,
    CompaniesModule,
    GaragesModule,
    SlotsModule,
    BookingsModule,
    ValetAssignmentsModule,
    BookingTimelinesModule,
    ReviewsModule,
    VerificationsModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CaptchaService,
    IpBlockingService,
    LoggingService,
    GlobalExceptionFilter,
  ],
  exports: [LoggingService],
})
export class AppModule {}
