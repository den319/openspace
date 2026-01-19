# 🚀 Production Security Setup Guide

This comprehensive guide covers all security features implemented in your NestJS application for production deployment.

## 📋 Table of Contents

### [Security Features Overview](#-security-features-overview)

### [1. Rate Limiting (ThrottlerGuard)](#1--rate-limiting-throttlerguard)
- [Configuration](#configuration)
- [Applied To](#applied-to)
- [Production Tuning](#production-tuning)
- [Monitoring](#monitoring)

### [2. CAPTCHA Verification (hCaptcha)](#2--captcha-verification-hcaptcha)
- [Setup Requirements](#setup-requirements)
- [Test Keys (Development Only)](#test-keys-development-only)
- [Applied To](#applied-to-1)
- [Frontend Integration](#frontend-integration)
- [Error Handling](#error-handling)

### [3. IP Blocking System](#3--ip-blocking-system)
- [Blocking Rules](#blocking-rules)
- [Automatic Blocking Triggers](#automatic-blocking-triggers)
- [Management](#management)
- [Production Monitoring](#production-monitoring)

### [4. Database Logging System](#4--database-logging-system)
- [Schema](#schema)
- [Log Categories](#log-categories)
- [Query Examples](#query-examples)
- [Cleanup](#cleanup)

### [5. File-Based Logging](#5--file-based-logging)
- [Storage Structure](#storage-structure)
- [Log Format](#log-format)
- [File Storage Criteria](#file-storage-criteria)
- [Management](#management-1)

### [6. Global Exception Handling](#6--global-exception-handling)
- [Features](#features)
- [Error Response Format](#error-response-format)
- [Production Configuration](#production-configuration)

### [Production Environment Setup](#-production-environment-setup)
- [Required Environment Variables](#required-environment-variables)
- [File System Permissions](#file-system-permissions)
- [Health Checks](#health-checks)

### [Monitoring & Alerting](#-monitoring--alerting)
- [Key Metrics to Monitor](#key-metrics-to-monitor)
- [Security Monitoring](#security-monitoring)
- [Log Size Monitoring](#log-size-monitoring)

### [Deployment Checklist](#-deployment-checklist)
- [Pre-Deployment](#pre-deployment)
- [Post-Deployment](#post-deployment)
- [Production Tuning](#production-tuning)

### [Troubleshooting](#-troubleshooting)
- [Common Issues](#common-issues)
- [1. Logs Not Writing to Files](#1-logs-not-writing-to-files)
- [2. CAPTCHA Not Working](#2-captcha-not-working)
- [3. High Error Rates](#3-high-error-rates)
- [4. IP Blocking Too Aggressive](#4-ip-blocking-too-aggressive)
- [5. Log Files Growing Too Large](#5-log-files-growing-too-large)

### [Additional Resources](#-additional-resources)

### [Security Scorecard](#-security-scorecard)

---

## 📋 Security Features Overview

| Feature | Purpose | Status |
|---------|---------|--------|
| **Rate Limiting** | Prevent abuse with request throttling | ✅ Implemented |
| **CAPTCHA Verification** | Human verification for sensitive operations | ✅ Implemented |
| **IP Blocking** | Automatic blocking of suspicious IPs | ✅ Implemented |
| **Database Logging** | Structured log storage and querying | ✅ Implemented |
| **File-Based Logging** | Daily error/warning logs for debugging | ✅ Implemented |
| **Global Exception Handling** | Centralized error logging and responses | ✅ Implemented |

---

## 1. 🔐 Rate Limiting (ThrottlerGuard)

### Configuration
```typescript
// In ThrottlerGuard
MAX_REQUESTS = 5      // Requests per window
WINDOW_MS = 900000   // 15 minutes window
```

### Applied To
- ✅ User registration endpoints
- ✅ User login endpoints
- ✅ All protected routes (can be extended)

### Production Tuning
```bash
# Environment variables for customization
THROTTLE_TTL=900000      # Window duration (15 minutes)
THROTTLE_LIMIT=5         # Max requests per window
```

### Monitoring
```bash
# Check rate limit hits in logs
grep "rate_limit_hit" src/storage/*_logs
```

---

## 2. 🤖 CAPTCHA Verification (hCaptcha)

### Setup Requirements
```bash
# 1. Sign up at https://hcaptcha.com
# 2. Get Site Key and Secret Key
# 3. Add to environment variables
HCAPTCHA_SECRET_KEY=your_secret_key_here
```

### Test Keys (Development Only)
```bash
HCAPTCHA_SECRET_KEY=0x0000000000000000000000000000000000000000
# Site Key: 10000000-ffff-ffff-ffff-000000000001
```

### Applied To
- ✅ User registration (`registerWithCredentials`)
- ✅ Can be extended to login, password reset, etc.

### Frontend Integration
```html
<script src="https://js.hcaptcha.com/1/api.js" async defer></script>
<div class="h-captcha" data-sitekey="your_site_key"></div>
```

```javascript
const captchaToken = hcaptcha.getResponse();
// Include in GraphQL mutation
```

### Error Handling
```typescript
// CAPTCHA failures are automatically logged
// Failed attempts contribute to IP blocking
```

---

## 3. 🛡️ IP Blocking System

### Blocking Rules
```typescript
MAX_FAILED_ATTEMPTS = 10     // Block after 10 failures
BLOCK_DURATION_MS = 86400000 // 24 hour block
MONITORING_WINDOW_MS = 3600000 // 1 hour monitoring
```

### Automatic Blocking Triggers
1. **10+ Failed Attempts** (registrations, logins)
2. **5+ Failed + 3+ CAPTCHA Failures**
3. **3+ Rate Limit Violations**

### Management
```typescript
// Check blocked IPs
const blockedIPs = ipBlockingService.getAllBlockedIPs()

// Manual blocking
ipBlockingService.blockIP('192.168.1.100', 'Suspicious activity')

// Manual unblocking
ipBlockingService.unblockIP('192.168.1.100')
```

### Production Monitoring
```bash
# Monitor blocked IPs
grep "blocked until" src/storage/*_logs

# Check blocking statistics
curl http://localhost:3000/api/admin/blocked-ips
```

---

## 4. 📊 Database Logging System

### Schema
```sql
model ServerLog {
  id Int @id @default(autoincrement())
  level LogLevel          // DEBUG, INFO, WARN, ERROR, CRITICAL
  category LogCategory    // SECURITY, API, AUTH, DATABASE, SYSTEM, USER_ACTIVITY
  message String
  details String?         // JSON details
  ip String?
  userId String?
  userAgent String?
  endpoint String?
  method String?
  statusCode Int?
  duration Float?
  errorStack String?
  errorName String?
  tags String[]
}
```

### Log Categories
- **SECURITY**: Failed logins, blocked IPs, suspicious activities
- **API**: HTTP requests with response codes and timing
- **AUTH**: Registration/login events
- **DATABASE**: CRUD operations tracking
- **SYSTEM**: Errors and exceptions
- **USER_ACTIVITY**: User actions and behavior

### Query Examples
```typescript
// Get recent security events
const securityLogs = await loggingService.getLogs({
  category: LogCategory.SECURITY,
  limit: 50
})

// Get error statistics
const stats = await loggingService.getLogStats()
```

### Cleanup
```typescript
// Clean up logs older than 30 days
await loggingService.cleanupOldLogs(30)
```

---

## 5. 📁 File-Based Logging

### Storage Structure
```
/src/storage/
├── 2024-01-13_logs    # Today's error/warning logs
├── 2024-01-12_logs    # Yesterday's logs
└── ...               # Previous days
```

### Log Format
```text
[2024-01-13T08:30:15.123Z] [ERROR] [SYSTEM] Database connection failed
Details: {"stack": "...", "name": "Error"}
Metadata: ip: 192.168.1.100, userId: user123
---
```

### File Storage Criteria
- ✅ **ERROR**: All application errors
- ✅ **WARN**: Warnings (4xx responses, etc.)
- ✅ **CRITICAL**: Critical system failures

### Management
```bash
# View today's logs
cat src/storage/$(date +%Y-%m-%d)_logs

# Search for specific errors
grep "Database connection" src/storage/*_logs

# Monitor log sizes
du -sh src/storage/*_logs

# Archive old logs
find src/storage -name "*_logs" -mtime +30 -exec gzip {} \;
```

---

## 6. 🚨 Global Exception Handling

### Features
- ✅ **Catches all unhandled errors**
- ✅ **Logs to both database and files**
- ✅ **Handles GraphQL and HTTP contexts**
- ✅ **Provides structured error responses**

### Error Response Format
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "timestamp": "2024-01-13T08:30:15.123Z",
  "path": "/api/users"
}
```

### Production Configuration
```typescript
// In main.ts
app.useGlobalFilters(new GlobalExceptionFilter(app.get(LoggingService)))
```

---

## 🔧 Production Environment Setup

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/prod_db

# JWT
JWT_SECRET=your_super_secure_jwt_secret_here

# hCaptcha (Production Keys)
HCAPTCHA_SECRET_KEY=your_production_secret_key

# Optional: Logging Configuration
LOG_RETENTION_DAYS=30
LOG_MIN_LEVEL=INFO
```

### File System Permissions
```bash
# Ensure proper permissions for log storage
chmod 755 src/storage
chmod 644 src/storage/*_logs

# Make storage directory persistent in Docker
VOLUME ["/app/src/storage"]
```

### Health Checks
```typescript
// Add to health check endpoint
@Get('health')
async getHealth() {
  const stats = await this.loggingService.getLogStats()
  const blockedCount = (await this.ipBlockingService.getAllBlockedIPs()).length

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    logs: {
      total: stats.totalLogs,
      errors: stats.logsByLevel.ERROR || 0,
    },
    security: {
      blockedIPs: blockedCount,
    }
  }
}
```

---

## 📈 Monitoring & Alerting

### Key Metrics to Monitor
```typescript
// Error rate monitoring
const stats = await loggingService.getLogStats()
const errorRate = stats.logsByLevel.ERROR / stats.totalLogs

if (errorRate > 0.1) { // 10% error rate
  // Send alert
  await alertService.sendAlert('High error rate detected', {
    errorRate: (errorRate * 100).toFixed(2) + '%',
    totalLogs: stats.totalLogs
  })
}
```

### Security Monitoring
```typescript
// Monitor failed login attempts
const recentSecurityLogs = await loggingService.getLogs({
  category: LogCategory.SECURITY,
  startDate: new Date(Date.now() - 60 * 60 * 1000) // Last hour
})

const failedLogins = recentSecurityLogs.filter(log =>
  log.message.includes('Login failed')
)

if (failedLogins.length > 10) {
  await alertService.sendSecurityAlert('High failed login rate', {
    count: failedLogins.length,
    timeWindow: '1 hour'
  })
}
```

### Log Size Monitoring
```bash
# Daily log size check
LOG_SIZE=$(stat -f%z src/storage/$(date +%Y-%m-%d)_logs 2>/dev/null || echo "0")
if [ "$LOG_SIZE" -gt 104857600 ]; then # 100MB
  echo "Large log file detected: $LOG_SIZE bytes"
  # Send alert and consider log rotation
fi
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Run database migrations: `npx prisma db push`
- [ ] Set production environment variables
- [ ] Get production hCaptcha keys
- [ ] Configure log rotation scripts
- [ ] Set up monitoring alerts

### Post-Deployment
- [ ] Verify log files are created in `/src/storage`
- [ ] Test CAPTCHA integration
- [ ] Verify rate limiting works
- [ ] Check database logging
- [ ] Monitor error rates
- [ ] Set up log archival

### Production Tuning
- [ ] Adjust rate limiting thresholds based on traffic
- [ ] Configure log retention based on storage capacity
- [ ] Set up automated log archival
- [ ] Configure alerting thresholds
- [ ] Enable log compression for older files

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Logs Not Writing to Files
```bash
# Check storage directory permissions
ls -la src/storage/

# Check if directory exists
ls -d src/storage

# Manual creation if needed
mkdir -p src/storage
```

#### 2. CAPTCHA Not Working
```bash
# Verify environment variable
echo $HCAPTCHA_SECRET_KEY

# Check logs for CAPTCHA errors
grep "CAPTCHA" src/storage/*_logs
```

#### 3. High Error Rates
```bash
# Check recent errors
tail -20 src/storage/$(date +%Y-%m-%d)_logs

# Get error statistics
curl http://localhost:3000/api/admin/logs/stats
```

#### 4. IP Blocking Too Aggressive
```typescript
// Adjust thresholds in IpBlockingService
MAX_FAILED_ATTEMPTS = 20  // Increase from 10
BLOCK_DURATION_MS = 3600000  // Reduce to 1 hour
```

#### 5. Log Files Growing Too Large
```bash
# Implement log rotation
find src/storage -name "*_logs" -mtime +7 -exec gzip {} \;

# Or adjust logging levels
LOG_MIN_LEVEL=WARN  # Only warnings and above
```

---

## 📚 Additional Resources

- **hCaptcha Documentation**: https://docs.hcaptcha.com/
- **NestJS Security Best Practices**: https://docs.nestjs.com/security
- **OWASP Security Guidelines**: https://owasp.org/www-project-top-ten/

---

## 🎯 Security Scorecard

After implementing all features:
- ✅ **Authentication Security**: JWT + bcrypt
- ✅ **Rate Limiting**: Request throttling
- ✅ **Bot Protection**: CAPTCHA verification
- ✅ **Abuse Prevention**: IP blocking system
- ✅ **Audit Trail**: Comprehensive logging
- ✅ **Error Handling**: Global exception management
- ✅ **Monitoring**: Real-time security metrics

**Result**: Enterprise-grade security suitable for production deployment! 🚀
