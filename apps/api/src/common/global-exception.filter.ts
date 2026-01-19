import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql'
import { LoggingService } from './logging/logging.service'

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  constructor(private readonly loggingService: LoggingService) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    // Check if it's a GraphQL context
    let isGraphQL = false
    let gqlContext: any = null

    try {
      gqlContext = GqlArgumentsHost.create(host)
      isGraphQL = true
    } catch {
      // Not a GraphQL context, continue with HTTP
    }

    // Extract request information
    const ip = this.getClientIP(request)
    const userId = this.getUserId(request, gqlContext)
    const userAgent = request?.headers?.['user-agent']
    const method = request?.method
    const url = request?.url || request?.originalUrl

    // Log the error
    await this.loggingService.logError(
      exception,
      isGraphQL ? 'GraphQL' : 'HTTP',
      ip,
      userId,
    )

    // Log additional context for debugging
    await this.loggingService.logSecurity(
      `Unhandled ${isGraphQL ? 'GraphQL' : 'HTTP'} error`,
      {
        error: exception.message,
        stack: exception.stack,
        url,
        method,
        userAgent,
        isGraphQL,
        timestamp: new Date().toISOString(),
      },
      ip,
      userId,
    )

    if (isGraphQL) {
      // For GraphQL, return the exception as-is (NestJS will handle formatting)
      throw exception
    } else {
      // For HTTP, format the response
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR

      const errorResponse = {
        statusCode: status,
        message: exception.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: url,
      }

      // Add stack trace in development
      if (process.env.NODE_ENV !== 'production') {
        errorResponse['stack'] = exception.stack
      }

      response.status(status).json(errorResponse)
    }
  }

  private getClientIP(request: any): string | undefined {
    return (
      request?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      request?.headers?.['x-real-ip'] ||
      request?.headers?.['x-client-ip'] ||
      request?.connection?.remoteAddress ||
      request?.socket?.remoteAddress ||
      request?.connection?.socket?.remoteAddress
    )
  }

  private getUserId(request: any, gqlContext: any): string | undefined {
    // Try different sources for user ID
    return (
      request?.user?.uid ||
      request?.user?.id ||
      gqlContext?.getContext()?.req?.user?.uid ||
      gqlContext?.getContext()?.user?.uid
    )
  }
}
