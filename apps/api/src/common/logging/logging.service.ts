import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as fs from 'fs'
import * as path from 'path'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum LogCategory {
  SECURITY = 'SECURITY',
  API = 'API',
  AUTH = 'AUTH',
  DATABASE = 'DATABASE',
  SYSTEM = 'SYSTEM',
  USER_ACTIVITY = 'USER_ACTIVITY',
}

interface LogData {
  level: LogLevel
  category: LogCategory
  message: string
  details?: any
  ip?: string
  userId?: string
  userAgent?: string
  endpoint?: string
  method?: string
  statusCode?: number
  duration?: number
  error?: Error
  tags?: string[]
}

@Injectable()
export class LoggingService {
  private readonly storagePath = path.join(process.cwd(), 'storage')

  constructor(private prisma: PrismaService) {
    // Ensure storage directory exists
    this.ensureStorageDirectory()
  }

  /**
   * Ensure the storage directory exists
   */
  private ensureStorageDirectory(): void {
    try {
      if (!fs.existsSync(this.storagePath)) {
        fs.mkdirSync(this.storagePath, { recursive: true })
        console.log(`Created storage directory: ${this.storagePath}`)
      }
    } catch (error) {
      console.error('Failed to create storage directory:', error)
    }
  }

  /**
   * Get the log file path for today
   */
  private getTodayLogFilePath(): string {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    return path.join(this.storagePath, `${today}_logs`)
  }

  /**
   * Write a log entry to the daily file (for errors and warnings only)
   */
  private async writeToFile(logData: LogData): Promise<void> {
    // Only write errors and warnings to file
    if (
      logData.level !== LogLevel.ERROR &&
      logData.level !== LogLevel.WARN &&
      logData.level !== LogLevel.CRITICAL
    ) {
      return
    }

    try {
      const filePath = this.getTodayLogFilePath()
      const timestamp = new Date().toISOString()

      // Format log entry
      let logEntry = `[${timestamp}] [${logData.level}] [${logData.category}] ${logData.message}\n`

      // Add details if present
      if (logData.details) {
        const detailsStr =
          typeof logData.details === 'string'
            ? logData.details
            : JSON.stringify(logData.details, null, 2)
        logEntry += `Details: ${detailsStr}\n`
      }

      // Add error stack if present
      if (logData.error?.stack) {
        logEntry += `Stack: ${logData.error.stack}\n`
      }

      // Add metadata
      const metadata = {
        ip: logData.ip,
        userId: logData.userId,
        userAgent: logData.userAgent,
        endpoint: logData.endpoint,
        method: logData.method,
        statusCode: logData.statusCode,
        duration: logData.duration,
      }

      const metadataStr = Object.entries(metadata)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')

      if (metadataStr) {
        logEntry += `Metadata: ${metadataStr}\n`
      }

      logEntry += '---\n'

      // Append to file
      fs.appendFileSync(filePath, logEntry, 'utf8')
    } catch (error) {
      console.error('Failed to write log to file:', error)
    }
  }

  /**
   * Log a security event
   */
  async logSecurity(
    message: string,
    details: any = {},
    ip?: string,
    userId?: string,
  ): Promise<void> {
    await this.log({
      level: LogLevel.WARN,
      category: LogCategory.SECURITY,
      message,
      details,
      ip,
      userId,
    })
  }

  /**
   * Log an authentication event
   */
  async logAuth(
    message: string,
    details: any = {},
    ip?: string,
    userId?: string,
  ): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.AUTH,
      message,
      details,
      ip,
      userId,
    })
  }

  /**
   * Log an API request
   */
  async logAPIRequest(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    ip?: string,
    userId?: string,
    userAgent?: string,
  ): Promise<void> {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO

    await this.log({
      level,
      category: LogCategory.API,
      message: `${method} ${endpoint} - ${statusCode}`,
      details: { method, endpoint, statusCode, duration },
      ip,
      userId,
      userAgent,
      endpoint,
      method,
      statusCode,
      duration,
    })
  }

  /**
   * Log an error
   */
  async logError(
    error: Error,
    context?: string,
    ip?: string,
    userId?: string,
  ): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      category: LogCategory.SYSTEM,
      message: `${context ? `[${context}] ` : ''}${error.message}`,
      details: {
        stack: error.stack,
        name: error.name,
        context,
      },
      ip,
      userId,
      error,
    })
  }

  /**
   * Log user activity
   */
  async logUserActivity(
    userId: string,
    action: string,
    details: any = {},
    ip?: string,
  ): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      category: LogCategory.USER_ACTIVITY,
      message: `User ${userId}: ${action}`,
      details: { action, ...details },
      ip,
      userId,
    })
  }

  /**
   * Log database operations
   */
  async logDatabase(
    operation: string,
    table: string,
    details: any = {},
    userId?: string,
  ): Promise<void> {
    await this.log({
      level: LogLevel.DEBUG,
      category: LogCategory.DATABASE,
      message: `DB ${operation} on ${table}`,
      details: { operation, table, ...details },
      userId,
    })
  }

  /**
   * Generic logging method
   */
  private async log(logData: LogData): Promise<void> {
    try {
      // Create log entry in database
      await this.prisma.serverLog.create({
        data: {
          level: logData.level,
          category: logData.category,
          message: logData.message,
          details: logData.details ? JSON.stringify(logData.details) : null,
          ip: logData.ip,
          userId: logData.userId,
          userAgent: logData.userAgent,
          endpoint: logData.endpoint,
          method: logData.method,
          statusCode: logData.statusCode,
          duration: logData.duration,
          errorStack: logData.error?.stack,
          errorName: logData.error?.name,
          tags: logData.tags,
        },
      })

      // Write to file for errors and warnings
      await this.writeToFile(logData)

      // Also log to console for immediate visibility
      const consoleMessage = `[${logData.level}] ${logData.category}: ${logData.message}`
      const consoleData = {
        timestamp: new Date().toISOString(),
        ...logData,
      }

      switch (logData.level) {
        case LogLevel.DEBUG:
          console.debug(consoleMessage, consoleData)
          break
        case LogLevel.INFO:
          console.info(consoleMessage, consoleData)
          break
        case LogLevel.WARN:
          console.warn(consoleMessage, consoleData)
          break
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(consoleMessage, consoleData)
          break
      }
    } catch (error) {
      // Fallback to console logging if database logging fails
      console.error('Failed to save log to database:', error)
      console.error('Original log data:', logData)

      // Still try to write to file as last resort
      try {
        await this.writeToFile(logData)
      } catch (fileError) {
        console.error('Failed to write log to file:', fileError)
      }
    }
  }

  /**
   * Get logs with filtering options
   */
  async getLogs(
    options: {
      level?: LogLevel
      category?: LogCategory
      userId?: string
      ip?: string
      limit?: number
      offset?: number
      startDate?: Date
      endDate?: Date
    } = {},
  ) {
    const {
      level,
      category,
      userId,
      ip,
      limit = 100,
      offset = 0,
      startDate,
      endDate,
    } = options

    return this.prisma.serverLog.findMany({
      where: {
        ...(level && { level }),
        ...(category && { category }),
        ...(userId && { userId }),
        ...(ip && { ip }),
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate && { gte: startDate }),
                ...(endDate && { lte: endDate }),
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
  }

  /**
   * Get log statistics
   */
  async getLogStats(
    options: {
      startDate?: Date
      endDate?: Date
    } = {},
  ) {
    const { startDate, endDate } = options

    const whereClause =
      startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}

    const [totalLogs, logsByLevel, logsByCategory, recentErrors] =
      await Promise.all([
        this.prisma.serverLog.count({ where: whereClause }),

        this.prisma.serverLog.groupBy({
          by: ['level'],
          _count: { level: true },
          where: whereClause,
        }),

        this.prisma.serverLog.groupBy({
          by: ['category'],
          _count: { category: true },
          where: whereClause,
        }),

        this.prisma.serverLog.findMany({
          where: {
            ...whereClause,
            level: { in: [LogLevel.ERROR, LogLevel.CRITICAL] },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ])

    return {
      totalLogs,
      logsByLevel: logsByLevel.reduce((acc, item) => {
        acc[item.level] = item._count.level
        return acc
      }, {} as Record<string, number>),
      logsByCategory: logsByCategory.reduce((acc, item) => {
        acc[item.category] = item._count.category
        return acc
      }, {} as Record<string, number>),
      recentErrors,
    }
  }

  /**
   * Clean up old logs (keep last 30 days by default)
   */
  async cleanupOldLogs(daysToKeep = 30): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await this.prisma.serverLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    console.log(`Cleaned up ${result.count} old log entries`)
    return result.count
  }
}
