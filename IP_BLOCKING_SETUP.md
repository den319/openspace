# IP-Based Blocking for Suspicious Activity

This guide explains how to set up and use the IP blocking system to protect against malicious user registration and other suspicious activities.

## Overview

The IP blocking system automatically monitors and blocks IPs that exhibit suspicious behavior patterns:

- **Failed Registration Attempts**: Too many failed registration attempts
- **CAPTCHA Failures**: Frequent CAPTCHA verification failures
- **Rate Limit Violations**: IPs that frequently hit rate limits
- **Combined Suspicious Patterns**: Failed attempts + CAPTCHA failures

## Configuration

### Blocking Rules

The system uses the following configurable thresholds:

```typescript
// In IpBlockingService
MAX_FAILED_ATTEMPTS = 10    // Block after 10 failed attempts
BLOCK_DURATION_MS = 24 * 60 * 60 * 1000  // 24 hour block
MONITORING_WINDOW_MS = 60 * 60 * 1000    // 1 hour monitoring window
```

### Blocking Criteria

An IP is automatically blocked if it meets any of these conditions:

1. **10+ Failed Attempts** in 1 hour
2. **5+ Failed Attempts + 3+ CAPTCHA Failures** in 1 hour
3. **3+ Rate Limit Hits** in 1 hour

## How It Works

### 1. Activity Monitoring

The system tracks these activities per IP:

```typescript
interface SuspiciousActivity {
  ip: string
  activityType: 'failed_attempt' | 'captcha_failure' | 'rate_limit_hit' | 'registration_attempt'
  timestamp: number
  userAgent?: string
  endpoint: string
}
```

### 2. Automatic Blocking

When suspicious patterns are detected, IPs are blocked for 24 hours:

```typescript
interface BlockedIP {
  ip: string
  blockedUntil: number
  reason: string
  attemptCount: number
  firstAttempt: number
  lastAttempt: number
}
```

### 3. Request Interception

Before processing registration requests, the system checks:

```typescript
// In users service
this.ipBlockingService.checkAndBlockIfSuspicious(req, 'registration_attempt', 'registerWithCredentials')
```

## Integration Points

### 1. Registration Service

```typescript
// Records failed attempts when registration fails
} catch (error) {
  if (req) {
    const ip = this.ipBlockingService.getClientIP(req)
    this.ipBlockingService.recordFailedAttempt(ip, error.message || 'Registration failed')
  }
  throw error
}
```

### 2. CAPTCHA Service

```typescript
// Records CAPTCHA failures
if (!data.success) {
  // CAPTCHA verification failed - could record here
}
```

### 3. Rate Limiting Guard

```typescript
// Records rate limit violations
if (requestData.count >= this.MAX_REQUESTS) {
  this.ipBlockingService.recordSuspiciousActivity(
    clientIP, 'rate_limit_hit', endpoint, userAgent
  )
}
```

## API Endpoints

### Check Blocked Status

```typescript
const isBlocked = ipBlockingService.isBlocked('192.168.1.100')
```

### Get Block Information

```typescript
const blockInfo = ipBlockingService.getBlockInfo('192.168.1.100')
// Returns: { ip, blockedUntil, reason, attemptCount, ... }
```

### Get Suspicious Activities

```typescript
const activities = ipBlockingService.getSuspiciousActivities('192.168.1.100')
```

### Get All Blocked IPs

```typescript
const blockedIPs = ipBlockingService.getAllBlockedIPs()
```

### Manual Blocking

```typescript
ipBlockingService.blockIP('192.168.1.100', 'Manual block for suspicious behavior')
```

### Manual Unblocking

```typescript
const success = ipBlockingService.unblockIP('192.168.1.100')
```

## Monitoring and Management

### Automatic Cleanup

- **Expired blocks** are automatically removed
- **Old activities** (older than 1 hour) are cleaned up every hour
- **Memory management** prevents unbounded growth

### Logging

The system logs blocking actions:

```typescript
console.warn(`IP ${ip} blocked until ${blockedUntil}: ${reason}`)
```

## Security Benefits

✅ **Automated Protection**: No manual intervention required
✅ **Pattern Recognition**: Detects sophisticated attack patterns
✅ **Temporary Blocks**: Allows legitimate users to retry after cooling off
✅ **Comprehensive Monitoring**: Tracks all suspicious activities
✅ **Memory Efficient**: Automatic cleanup prevents memory leaks

## Production Considerations

### 1. Database Persistence (Recommended)

For production, consider persisting blocked IPs to database:

```typescript
// Store in database instead of memory
await this.prisma.blockedIP.create({
  data: { ip, blockedUntil, reason }
})
```

### 2. Distributed Systems

For multiple server instances, use Redis or shared database:

```typescript
// Use Redis for distributed blocking
await this.redis.setex(`blocked:${ip}`, ttl, reason)
```

### 3. Advanced Rules

Customize blocking rules based on your needs:

```typescript
// Geographic blocking
if (isFromHighRiskCountry(ip)) {
  this.blockIP(ip, 'High-risk geographic location')
}

// Time-based patterns
if (isBruteForceTiming(activities)) {
  this.blockIP(ip, 'Brute force timing pattern detected')
}
```

### 4. Whitelisting

Add IP whitelisting for trusted addresses:

```typescript
if (this.isWhitelisted(ip)) {
  return // Skip blocking checks
}
```

## Troubleshooting

### Common Issues

1. **False Positives**: Adjust thresholds in configuration
2. **Memory Usage**: Monitor cleanup intervals
3. **Proxy Headers**: Ensure correct IP extraction from headers
4. **Distributed Blocking**: Implement shared storage for multiple servers

### Debug Information

Enable debug logging to monitor blocking activity:

```typescript
console.log('Blocked IPs:', ipBlockingService.getAllBlockedIPs())
console.log('Suspicious activities:', ipBlockingService.getSuspiciousActivities(ip))
```

## Testing

### Unit Tests

```typescript
describe('IpBlockingService', () => {
  it('should block IP after max failed attempts', () => {
    // Test automatic blocking
  })

  it('should expire blocks after duration', () => {
    // Test block expiration
  })
})
```

### Integration Tests

```typescript
describe('Registration Protection', () => {
  it('should block IP after repeated failures', async () => {
    // Simulate multiple failed registrations
    // Verify IP gets blocked
  })
})
```

## Security Best Practices

1. **Start Conservative**: Begin with higher thresholds and adjust based on traffic
2. **Monitor False Positives**: Regularly review blocked IPs
3. **Combine with Other Protections**: Use alongside CAPTCHA, rate limiting, and authentication
4. **Legal Compliance**: Ensure blocking practices comply with local laws
5. **User Communication**: Provide clear messaging for blocked users

## Files Modified

- `apps/api/src/common/ip-blocking.service.ts` - Main blocking logic
- `apps/api/src/models/users/graphql/users.service.ts` - Integration for failed attempts
- `apps/api/src/common/captcha.service.ts` - CAPTCHA failure tracking
- `apps/api/src/common/auth/throttle.guard.ts` - Rate limit violation tracking
- `apps/api/src/app.module.ts` - Service registration

This IP blocking system provides robust, automated protection against malicious registration attempts while maintaining usability for legitimate users.
