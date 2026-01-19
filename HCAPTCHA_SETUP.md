# hCaptcha Integration Setup

This guide explains how to set up hCaptcha for your NestJS application to protect against malicious user registration.

## 1. Get hCaptcha Keys

1. Visit [hCaptcha.com](https://www.hcaptcha.com/)
2. Sign up for a free account
3. Create a new site in your dashboard
4. Note down your **Site Key** and **Secret Key**

## 2. Environment Configuration

Add the following to your `.env` file:

```bash
# hCaptcha Configuration
HCAPTCHA_SECRET_KEY=your_secret_key_here
```

## 3. Install Dependencies

The implementation uses `node-fetch` for HTTP requests. Install it if not already present:

```bash
npm install node-fetch
npm install --save-dev @types/node-fetch
```

## 4. Frontend Integration

### HTML Setup
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
</head>
<body>
    <form id="registrationForm">
        <!-- Your form fields -->
        <div class="h-captcha" data-sitekey="your_site_key_here"></div>
        <button type="submit">Register</button>
    </form>
</body>
</html>
```

### JavaScript Integration
```javascript
// Get CAPTCHA response
const captchaResponse = hcaptcha.getResponse();

if (!captchaResponse) {
    alert('Please complete the CAPTCHA verification.');
    return;
}

// Include in your GraphQL mutation
const mutation = `
    mutation RegisterWithCredentials($input: RegisterWithCredentialsInput!) {
        registerWithCredentials(registerWithCredentialsInput: $input) {
            uid
            name
        }
    }
`;

const variables = {
    input: {
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword",
        captchaToken: captchaResponse
    }
};
```

## 5. Testing

### Development Mode
If `HCAPTCHA_SECRET_KEY` is not set, CAPTCHA validation is disabled for development:
```
HCAPTCHA_SECRET_KEY not configured - CAPTCHA validation disabled
```

### Test Keys
hCaptcha provides test keys for development:
- **Site Key**: `10000000-ffff-ffff-ffff-000000000001`
- **Secret Key**: `0x0000000000000000000000000000000000000000`

## 6. Production Deployment

1. Replace test keys with production keys
2. Ensure `HCAPTCHA_SECRET_KEY` is set in production environment
3. Monitor CAPTCHA verification logs
4. Consider implementing additional rate limiting

## 7. Error Handling

The CAPTCHA service throws `BadRequestException` for:
- Missing CAPTCHA token
- Invalid CAPTCHA token
- hCaptcha API errors

Handle these errors in your frontend:

```javascript
try {
    const result = await registerUser(variables);
    // Success
} catch (error) {
    if (error.message.includes('CAPTCHA')) {
        // Reset CAPTCHA widget
        hcaptcha.reset();
    }
    // Show error message
}
```

## 8. Security Benefits

✅ **Bot Protection**: Prevents automated registration attempts
✅ **Spam Prevention**: Blocks malicious user creation
✅ **Rate Limiting**: Combined with ThrottlerGuard for layered protection
✅ **Privacy-Focused**: hCaptcha is privacy-respecting alternative to reCAPTCHA

## 9. API Limits

hCaptcha offers:
- **Free Tier**: 1 million verifications per month
- **Enterprise**: Higher limits available

Monitor your usage in the hCaptcha dashboard.

## 10. Troubleshooting

### Common Issues:
1. **CAPTCHA not loading**: Check site key is correct
2. **Verification failing**: Ensure secret key is properly set
3. **Network errors**: Check firewall allows hcaptcha.com

### Debug Mode:
Add logging to see CAPTCHA verification results:
```typescript
console.log('CAPTCHA response:', captchaResponse);
