import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface BlockedIP {
  ip: string
  blockedUntil: number
  reason: string
  attemptCount: number
  firstAttempt: number
  lastAttempt: number
}

interface SuspiciousActivity {
  ip: string
  activityType: string
  timestamp: number
  userAgent?: string
  endpoint: string
}

@Injectable()
export class IpBlockingService {
  private blockedIPs = new Map<string, BlockedIP>()
  private suspiciousActivities = new Map<string, SuspiciousActivity[]>()

  // Configuration
  private readonly MAX_FAILED_ATTEMPTS = 10 // Max failed attempts before blocking
  private readonly BLOCK_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours block
  private readonly MONITORING_WINDOW_MS = 60 * 60 * 1000 // 1 hour monitoring window
  private readonly CLEANUP_INTERVAL_MS = 60 * 60 * 1000 // Clean up every hour

  constructor(private configService: ConfigService) {
    // Start cleanup interval
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL_MS)
  }

  /**
   * Check if IP is blocked
   */
  isBlocked(ip: string): boolean {
    const blockedIP = this.blockedIPs.get(ip)
    if (!blockedIP) return false

    // Check if block has expired
    if (Date.now() > blockedIP.blockedUntil) {
      this.blockedIPs.delete(ip)
      return false
    }

    return true
  }

  /**
   * Get block information for an IP
   */
  getBlockInfo(ip: string): BlockedIP | null {
    return this.blockedIPs.get(ip) || null
  }

  /**
   * Record suspicious activity
   */
  recordSuspiciousActivity(
    ip: string,
    activityType: string,
    endpoint: string,
    userAgent?: string,
  ): void {
    const activity: SuspiciousActivity = {
      ip,
      activityType,
      timestamp: Date.now(),
      userAgent,
      endpoint,
    }

    const activities = this.suspiciousActivities.get(ip) || []
    activities.push(activity)

    // Keep only recent activities within monitoring window
    const recentActivities = activities.filter(
      (a) => Date.now() - a.timestamp < this.MONITORING_WINDOW_MS,
    )

    this.suspiciousActivities.set(ip, recentActivities)

    // Check if IP should be blocked
    this.checkForBlocking(ip, recentActivities)
  }

  /**
   * Record failed authentication/registration attempt
   */
  recordFailedAttempt(ip: string, reason: string): void {
    const blockedIP = this.blockedIPs.get(ip)

    if (blockedIP) {
      // Already blocked, update last attempt
      blockedIP.lastAttempt = Date.now()
      blockedIP.attemptCount++
      return
    }

    // Record suspicious activity
    this.recordSuspiciousActivity(ip, 'failed_attempt', 'auth', reason)

    // Check if should block
    const activities = this.suspiciousActivities.get(ip) || []
    if (activities.length >= this.MAX_FAILED_ATTEMPTS) {
      this.blockIP(ip, `Too many failed attempts: ${activities.length}`)
    }
  }

  /**
   * Manually block an IP
   */
  blockIP(ip: string, reason: string): void {
    const now = Date.now()
    const blockedIP: BlockedIP = {
      ip,
      blockedUntil: now + this.BLOCK_DURATION_MS,
      reason,
      attemptCount: 0,
      firstAttempt: now,
      lastAttempt: now,
    }

    this.blockedIPs.set(ip, blockedIP)
    console.warn(
      `IP ${ip} blocked until ${new Date(
        blockedIP.blockedUntil,
      ).toISOString()}: ${reason}`,
    )
  }

  /**
   * Unblock an IP
   */
  unblockIP(ip: string): boolean {
    return this.blockedIPs.delete(ip)
  }

  /**
   * Get suspicious activities for an IP
   */
  getSuspiciousActivities(ip: string): SuspiciousActivity[] {
    return this.suspiciousActivities.get(ip) || []
  }

  /**
   * Get all blocked IPs
   */
  getAllBlockedIPs(): BlockedIP[] {
    return Array.from(this.blockedIPs.values())
  }

  /**
   * Check if IP should be blocked based on activity patterns
   */
  private checkForBlocking(ip: string, activities: SuspiciousActivity[]): void {
    const failedAttempts = activities.filter(
      (a) => a.activityType === 'failed_attempt',
    ).length
    const captchaFailures = activities.filter(
      (a) => a.activityType === 'captcha_failure',
    ).length
    const rateLimitHits = activities.filter(
      (a) => a.activityType === 'rate_limit_hit',
    ).length

    // Block if too many failed attempts
    if (failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      this.blockIP(ip, `Too many failed attempts: ${failedAttempts}`)
      return
    }

    // Block if suspicious pattern detected
    if (failedAttempts >= 5 && captchaFailures >= 3) {
      this.blockIP(
        ip,
        `Suspicious pattern: ${failedAttempts} failed attempts, ${captchaFailures} CAPTCHA failures`,
      )
      return
    }

    // Block if hitting rate limits frequently
    if (rateLimitHits >= 3) {
      this.blockIP(ip, `Frequent rate limit violations: ${rateLimitHits}`)
      return
    }
  }

  /**
   * Clean up expired blocks and old activities
   */
  private cleanup(): void {
    const now = Date.now()

    // Remove expired blocks
    for (const [ip, blockedIP] of this.blockedIPs) {
      if (now > blockedIP.blockedUntil) {
        this.blockedIPs.delete(ip)
      }
    }

    // Clean up old suspicious activities
    for (const [ip, activities] of this.suspiciousActivities) {
      const recentActivities = activities.filter(
        (a) => now - a.timestamp < this.MONITORING_WINDOW_MS,
      )

      if (recentActivities.length === 0) {
        this.suspiciousActivities.delete(ip)
      } else {
        this.suspiciousActivities.set(ip, recentActivities)
      }
    }
  }

  /**
   * Get client IP from request
   */
  getClientIP(req: any): string {
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

  /**
   * Check if request should be blocked and throw error if so
   */
  checkAndBlockIfSuspicious(
    req: any,
    activityType: string,
    endpoint: string,
  ): void {
    const ip = this.getClientIP(req)

    if (this.isBlocked(ip)) {
      const blockInfo = this.getBlockInfo(ip)
      throw new BadRequestException(
        `IP address blocked until ${new Date(
          blockInfo!.blockedUntil,
        ).toISOString()}. Reason: ${blockInfo!.reason}`,
      )
    }

    // Record the activity for monitoring
    this.recordSuspiciousActivity(
      ip,
      activityType,
      endpoint,
      req.headers['user-agent'],
    )
  }
}
