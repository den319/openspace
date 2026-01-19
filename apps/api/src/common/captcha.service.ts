import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IpBlockingService } from './ip-blocking.service'
import fetch from 'node-fetch'

interface HCaptchaResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

@Injectable()
export class CaptchaService {
  private readonly hcaptchaSecret: string
  private readonly hcaptchaVerifyUrl = 'https://hcaptcha.com/siteverify'

  constructor(
    private configService: ConfigService,
    private ipBlockingService: IpBlockingService,
  ) {
    // Get from environment variables - you need to set HCAPTCHA_SECRET_KEY
    this.hcaptchaSecret = this.configService.get<string>(
      'HCAPTCHA_SECRET_KEY',
      '',
    )
  }

  async verifyCaptcha(token: string, remoteip?: string): Promise<boolean> {
    if (!this.hcaptchaSecret) {
      // For development/testing, you can disable CAPTCHA validation
      console.warn(
        'HCAPTCHA_SECRET_KEY not configured - CAPTCHA validation disabled',
      )
      return true
    }

    if (!token || token.trim() === '') {
      throw new BadRequestException('CAPTCHA token is required')
    }

    try {
      const params = new URLSearchParams({
        secret: this.hcaptchaSecret,
        response: token,
      })

      if (remoteip) {
        params.append('remoteip', remoteip)
      }

      const response = await fetch(this.hcaptchaVerifyUrl, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      if (!response.ok) {
        throw new Error(`hCaptcha API error: ${response.status}`)
      }

      const data: HCaptchaResponse = await response.json()

      if (!data.success) {
        const errorCodes = data['error-codes']?.join(', ') || 'Unknown error'
        throw new BadRequestException(
          `CAPTCHA verification failed: ${errorCodes}`,
        )
      }

      return true
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }

      console.error('CAPTCHA verification error:', error)
      throw new BadRequestException('CAPTCHA verification failed')
    }
  }

  // Method to get client IP for optional remoteip parameter
  getClientIP(req: any): string | undefined {
    return (
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.headers['x-client-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress
    )
  }
}
