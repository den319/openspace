import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { UpdateUserInput } from './dtos/update-user.input'
import { JwtService } from '@nestjs/jwt'
import {
  LoginInput,
  LoginOutput,
  RegisterWithCredentialsInput,
  RegisterWithProviderInput,
} from './dtos/create-user.input'
import * as bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { AuthProviderType } from '@prisma/client'
import { CaptchaService } from 'src/common/captcha.service'
import { IpBlockingService } from 'src/common/ip-blocking.service'
import { LoggingService } from 'src/common/logging/logging.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly captchaService: CaptchaService,
    private readonly ipBlockingService: IpBlockingService,
    private readonly loggingService: LoggingService,
  ) {}

  registerWithProvider({ image, name, uid, type }: RegisterWithProviderInput) {
    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        AuthProvider: {
          create: {
            type,
          },
        },
      },
    })
  }

  async registerWithCredentials(
    { email, name, password, image }: RegisterWithCredentialsInput,
    req?: any,
  ) {
    const ip = req ? this.ipBlockingService.getClientIP(req) : undefined
    const userAgent = req?.headers?.['user-agent']

    try {
      // Check if IP is blocked
      // if (req) {
      //   this.ipBlockingService.checkAndBlockIfSuspicious(req, 'registration_attempt', 'registerWithCredentials')
      // }

      // Log registration attempt
      await this.loggingService.logAuth(
        `Registration attempt for email: ${email}`,
        { email, name },
        ip,
      )

      // Verify CAPTCHA token
      // await this.captchaService.verifyCaptcha(captchaToken)

      const existingUser = await this.prisma.credentials.findUnique({
        where: { email },
      })

      if (existingUser) {
        await this.loggingService.logSecurity(
          `Registration failed - email already exists: ${email}`,
          { email },
          ip,
        )
        throw new BadRequestException('User already exists with this email.')
      }

      // Hash the password
      const salt = bcrypt.genSaltSync()
      const passwordHash = bcrypt.hashSync(password, salt)

      const uid = uuid()

      const user = await this.prisma.user.create({
        data: {
          uid,
          name,
          image,
          Credentials: {
            create: {
              email,
              passwordHash,
            },
          },
          AuthProvider: {
            create: {
              type: AuthProviderType.CREDENTIALS,
            },
          },
        },
        include: {
          Credentials: true,
        },
      })

      // Log successful registration
      await this.loggingService.logAuth(
        `User registered successfully: ${uid}`,
        { uid, email, name },
        ip,
        uid,
      )

      return user
    } catch (error) {
      // Record failed attempt for IP blocking
      // if (req) {
      //   this.ipBlockingService.recordFailedAttempt(ip!, error.message || 'Registration failed')
      // }

      // Log registration failure
      await this.loggingService.logSecurity(
        `Registration failed: ${error.message}`,
        { email, error: error.message },
        ip,
      )

      throw error
    }
  }

  async login(
    { email, password }: LoginInput,
    req?: any,
  ): Promise<LoginOutput> {
    // const ip = req ? this.ipBlockingService.getClientIP(req) : undefined

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          Credentials: { email },
        },
        include: {
          Credentials: true,
        },
      })

      if (!user) {
        await this.loggingService.logSecurity(
          `Login failed - user not found: ${email}`,
          { email },
          // ip,
        )
        throw new UnauthorizedException('Invalid email or password.')
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user.Credentials.passwordHash,
      )

      if (!isPasswordValid) {
        await this.loggingService.logSecurity(
          `Login failed - invalid password: ${email}`,
          { email, userId: user.uid },
          // ip,
          user.uid,
        )
        throw new UnauthorizedException('Invalid email or password.')
      }

      const jwtToken = this.jwtService.sign(
        { uid: user.uid },
        {
          algorithm: 'HS256',
        },
      )

      // Log successful login
      await this.loggingService.logAuth(
        `User logged in successfully: ${user.uid}`,
        { email },
        // ip,
        user.uid,
      )

      return {
        token: jwtToken,
        user,
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Record failed login attempt for IP blocking
        // if (req && ip) {
        //   this.ipBlockingService.recordFailedAttempt(ip, 'Invalid login credentials')
        // }
      } else {
        // Log unexpected errors
        await this.loggingService.logError(
          error,
          'login',
          // ip,
        )
      }
      throw error
    }
  }

  findAll(args: FindManyUserArgs) {
    return this.prisma.user.findMany(args)
  }

  findOne(args: FindUniqueUserArgs) {
    return this.prisma.user.findUnique(args)
  }

  update(updateUserInput: UpdateUserInput) {
    const { uid, ...data } = updateUserInput
    return this.prisma.user.update({
      where: { uid },
      data: data,
    })
  }

  remove(args: FindUniqueUserArgs) {
    return this.prisma.user.delete(args)
  }
}
