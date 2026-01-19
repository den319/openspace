# Server Logging System Setup

This guide explains how to set up and use the comprehensive server logging system for debugging and monitoring your NestJS application.

## Overview

The logging system provides structured logging capabilities with database persistence, allowing you to:

- Track security events (failed logins, blocked IPs, etc.)
- Monitor API usage and performance
- Log authentication events
- Record database operations
- Track user activities
- Debug application errors

## Database Schema

The system uses a `ServerLog` table with the following structure:

```sql
model ServerLog {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())

  level LogLevel          // DEBUG, INFO, WARN, ERROR, CRITICAL
  category LogCategory    // SECURITY, API, AUTH, DATABASE, SYSTEM, USER_ACTIVITY
  message String
  details String?         // JSON string of additional data
  ip String?
  userId String?
  userAgent String?
  endpoint String?
  method String?          // HTTP method
  statusCode Int?         // HTTP status code
  duration Float?         // Request duration in ms
  errorStack String?
  errorName String?
  tags String[]           // Custom tags for filtering

  @@index([level])
  @@index([category])
  @@index([userId])
  @@index([ip])
  @@index([createdAt])
}
```

## Logging Categories

### 🔒 Security Events
```typescript
await loggingService.logSecurity(
  'Failed login attempt',
  { email: 'user@example.com' },
  '192.168.1.100',
  'user123'
)
```

### 🔐 Authentication Events
```typescript
await loggingService.logAuth(
  'User logged in successfully',
  { email: 'user@example.com' },
  '192.168.1.100',
  'user123'
)
```

### 🌐 API Requests
```typescript
await loggingService.logAPIRequest(
  'GET',
  '/api/users',
  200,
  150.5, // duration in ms
  '192.168.1.100',
  'user123',
  'Mozilla/5.0...'
)
```

### 🚨 Error Logging
```typescript
await loggingService.logError(
  new Error('Database connection failed'),
  'DatabaseService.connect',
  '192.168.1.100',
  'user123'
)
```

### 👤 User Activity
```typescript
await loggingService.logUserActivity(
  'user123',
  'Updated profile',
  { field: 'name', oldValue: 'John', newValue: 'Jane' },
  '192.168.1.100'
)
```

### 💾 Database Operations
```typescript
await loggingService.logDatabase(
  'UPDATE',
  'users',
  { userId: 'user123', fields: ['name', 'email'] },
  'user123'
)
```

## Integration Examples

### Users Service Integration

```typescript
// In users.service.ts
async registerWithCredentials(input, req) {
  try {
    // Log registration attempt
    await this.loggingService.logAuth(
      `Registration attempt for email: ${input.email}`,
      { email: input.email, name: input.name },
      ip
    )

    // Registration logic...

    // Log successful registration
    await this.loggingService.logAuth(
      `User registered successfully: ${uid}`,
      { uid, email: input.email, name: input.name },
      ip,
      uid
    )

    return user
  } catch (error) {
    // Log registration failure
    await this.loggingService.logSecurity(
      `Registration failed: ${error.message}`,
      { email: input.email, error: error.message },
      ip
    )
    throw error
  }
}
```

### Global Error Handling

```typescript
// In main.ts or global exception filter
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private loggingService: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const ip = request.ip || request.connection.remoteAddress
    const userId = request.user?.uid

    this.loggingService.logError(
      exception,
      'GlobalExceptionFilter',
      ip,
      userId
    )

    // Handle response...
  }
}
```

## Querying Logs

### Get Logs with Filters

```typescript
// Get recent security events
const securityLogs = await loggingService.getLogs({
  category: LogCategory.SECURITY,
  limit: 50,
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
})

// Get API errors
const apiErrors = await loggingService.getLogs({
  category: LogCategory.API,
  level: LogLevel.ERROR
})

// Get user activity
const userActivity = await loggingService.getLogs({
  userId: 'user123',
  category: LogCategory.USER_ACTIVITY
})
```

### Get Statistics

```typescript
const stats = await loggingService.getLogStats({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
})

// Returns:
// {
//   totalLogs: 15420,
//   logsByLevel: { DEBUG: 12000, INFO: 2500, WARN: 500, ERROR: 400, CRITICAL: 20 },
//   logsByCategory: { API: 10000, AUTH: 2000, SECURITY: 1500, ... },
//   recentErrors: [...] // Last 10 errors
// }
```

## Cleanup Management

### Automatic Cleanup

The system includes automatic cleanup of old logs:

```typescript
// Clean up logs older than 30 days
await loggingService.cleanupOldLogs(30) // Returns number of deleted logs
```

### Manual Cleanup

```typescript
// Clean up logs older than 90 days
await loggingService.cleanupOldLogs(90)
```

## Admin Interface

### REST API for Log Management

```typescript
// In admin controller
@Get('logs')
async getLogs(@Query() query: LogQueryDto) {
  return this.loggingService.getLogs({
    level: query.level,
    category: query.category,
    userId: query.userId,
    ip: query.ip,
    limit: query.limit || 100,
    offset: query.offset || 0,
    startDate: query.startDate,
    endDate: query.endDate,
  })
}

@Get('logs/stats')
async getLogStats(@Query() query: DateRangeQueryDto) {
  return this.loggingService.getLogStats({
    startDate: query.startDate,
    endDate: query.endDate,
  })
}
```

### GraphQL Queries

```graphql
query GetSecurityLogs {
  securityLogs: getLogs(category: SECURITY, limit: 50) {
    id
    createdAt
    level
    message
    details
    ip
    userId
  }
}

query GetLogStats {
  stats: getLogStats {
    totalLogs
    logsByLevel
    logsByCategory
    recentErrors {
      id
      message
      details
      createdAt
    }
  }
}
```

## Configuration

### Environment Variables

```bash
# Log retention (optional - defaults to 30 days)
LOG_RETENTION_DAYS=30

# Log level filtering (optional - logs all levels by default)
LOG_MIN_LEVEL=INFO
```

### Performance Considerations

- **Indexing**: The schema includes indexes on frequently queried fields
- **Cleanup**: Regular cleanup prevents unbounded growth
- **Async Logging**: All logging operations are asynchronous
- **Fallback**: Console logging if database logging fails

## Monitoring and Alerts

### Real-time Monitoring

```typescript
// Monitor error rate
const stats = await loggingService.getLogStats()
const errorRate = stats.logsByLevel.ERROR / stats.totalLogs

if (errorRate > 0.1) { // 10% error rate
  // Send alert
  await this.alertService.sendAlert('High error rate detected', {
    errorRate,
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
  // Send security alert
  await this.alertService.sendSecurityAlert('High number of failed logins', {
    count: failedLogins.length,
    timeWindow: '1 hour'
  })
}
```

## Best Practices

### 1. Consistent Message Format
```typescript
// Good: Structured messages
await loggingService.logSecurity('User login failed', { email, reason }, ip, userId)

// Bad: Unstructured messages
await loggingService.logSecurity(`Login failed for ${email}: ${reason}`, {}, ip)
```

### 2. Appropriate Log Levels
- **DEBUG**: Detailed debugging information
- **INFO**: Normal operational events
- **WARN**: Warning conditions
- **ERROR**: Error conditions
- **CRITICAL**: Critical system failures

### 3. Sensitive Data
```typescript
// Never log sensitive data
// BAD:
await loggingService.logAuth('Login successful', { password: 'secret123' })

// GOOD:
await loggingService.logAuth('Login successful', { userId: 'user123' })
```

### 4. Performance
- Avoid logging in hot paths
- Use appropriate detail levels
- Implement log sampling for high-volume operations

## Files Modified

- `apps/api/src/common/logging.service.ts` - Main logging service
- `apps/api/prisma/schema.prisma` - Database schema
- `apps/api/src/app.module.ts` - Service registration
- `apps/api/src/models/users/graphql/users.service.ts` - Integration example

This logging system provides comprehensive observability for debugging, monitoring, and security analysis of your application.
