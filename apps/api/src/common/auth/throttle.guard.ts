import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { IpBlockingService } from '../ip-blocking.service'

@Injectable()
export class ThrottlerGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>()

  // Rate limiting configuration
  private readonly MAX_REQUESTS = 5 // Max requests per window
  private readonly WINDOW_MS = 15 * 60 * 1000 // 15 minutes window

  constructor(private ipBlockingService: IpBlockingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req

    const clientIP = this.getClientIP(req)
    const key = `${context.getClass().name}:${
      context.getHandler().name
    }:${clientIP}`

    const now = Date.now()
    const requestData = this.requests.get(key)

    if (!requestData || now > requestData.resetTime) {
      // First request or window expired, reset counter
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      })
      return true
    }

    if (requestData.count >= this.MAX_REQUESTS) {
      // Rate limit exceeded - record for IP blocking
      this.ipBlockingService.recordSuspiciousActivity(
        clientIP,
        'rate_limit_hit',
        `${context.getClass().name}:${context.getHandler().name}`,
        req.headers['user-agent'],
      )

      throw new BadRequestException(
        `Too many requests. Try again after ${Math.ceil(
          (requestData.resetTime - now) / 1000 / 60,
        )} minutes.`,
      )
    }

    // Increment counter
    requestData.count++
    this.requests.set(key, requestData)

    return true
  }

  private getClientIP(req: any): string {
    // Get IP from various headers (considering proxies)
    return (
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.headers['x-client-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      'unknown'
    )
  }
}
