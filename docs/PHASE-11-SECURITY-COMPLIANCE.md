# Phase 11: Security & Compliance - Complete Documentation

## ✅ Implementation Complete

**Phase 11 has been fully implemented with production-ready security and GDPR compliance features.**

---

## 🛡️ Security Features Implemented

### 1. Rate Limiting

**Location:** `apps/backend/src/middleware/rate-limit.middleware.ts`

Protects against brute force attacks and API abuse with tiered rate limiting:

- **Global:** 100 requests per 15 minutes
- **Authentication:** 5 attempts per 15 minutes  
- **Registration:** 3 registrations per hour
- **Password Reset:** 3 attempts per hour
- **API Endpoints:** 60 requests per minute
- **File Upload:** 10 uploads per 15 minutes
- **Search:** 30 queries per minute

**Usage:**
```typescript
// Apply to specific routes
server.get('/api/search', {
  config: { rateLimit: rateLimitConfig.search }
}, handler);

// Or use pre-configured decorators
server.post('/auth/login', strictRateLimit, handler);
```

**Features:**
- IP-based and user-based rate limiting
- Automatic lockout on exceeded limits
- Configurable time windows
- Custom error messages
- Redis support for distributed systems

---

### 2. CSRF Protection

**Location:** `apps/backend/src/middleware/csrf.middleware.ts`

Prevents Cross-Site Request Forgery attacks:

- Session-based CSRF tokens
- Automatic validation for state-changing requests (POST, PUT, DELETE)
- JWT routes exempt (they use bearer tokens)
- Token generation endpoint for SPAs

**Usage:**
```typescript
// Get CSRF token (frontend)
GET /api/csrf-token

// Include in requests
headers: { 'X-CSRF-Token': token }
// OR in body
body: { csrfToken: token }
```

**Configuration:**
- HTTPOnly cookies
- SameSite=Strict
- Secure flag in production
- Signed cookies

---

### 3. Security Headers

**Location:** `apps/backend/src/middleware/security-headers.middleware.ts`

Comprehensive security headers using Helmet:

#### Implemented Headers:
- **Content-Security-Policy (CSP):** Prevents XSS attacks
- **X-Frame-Options:** Prevents clickjacking (DENY)
- **X-Content-Type-Options:** Prevents MIME sniffing (nosniff)
- **Strict-Transport-Security (HSTS):** Enforces HTTPS (1 year)
- **X-XSS-Protection:** Legacy XSS protection
- **Referrer-Policy:** Controls referrer information
- **Permissions-Policy:** Restricts browser features
- **Cross-Origin policies:** COEP, COOP, CORP

#### CSP Directives:
```typescript
defaultSrc: ["'self'"]
scriptSrc: ["'self'", Google Analytics]
styleSrc: ["'self'", "'unsafe-inline'", Google Fonts]
imgSrc: ["'self'", "data:", "https:", "blob:"]
connectSrc: ["'self'", Analytics]
objectSrc: ["'none'"]
```

#### CORS Configuration:
- Whitelist approach for allowed origins
- Credentials support enabled
- Specific allowed methods and headers
- Preflight request caching (24 hours)

---

### 4. Input Validation & Sanitization

**Location:** `apps/backend/src/lib/validation.ts`

Comprehensive validation using Zod with automatic sanitization:

#### Sanitization Features:
```typescript
// HTML sanitization (XSS prevention)
Sanitizer.html(input)  // Allows safe tags only

// Plain text (strips all HTML)
Sanitizer.text(input)

// Email normalization
Sanitizer.email(input)

// URL validation
Sanitizer.url(input)

// SQL injection prevention
Sanitizer.sql(input)

// Strip dangerous characters
Sanitizer.stripDangerous(input)
```

#### Validation Schemas:
- **Email:** Format validation, length limits, normalization
- **Password:** 8+ chars, uppercase, lowercase, number, special char
- **Name:** Length limits, HTML stripping
- **URLs:** Format validation, length limits
- **Phone:** International format validation
- **UUIDs:** Format validation
- **Prices:** Positive, max value, decimal precision
- **Files:** Type validation, size limits

#### Pre-built Schemas:
```typescript
// User schemas
UserSchemas.register
UserSchemas.login
UserSchemas.updateProfile
UserSchemas.changePassword

// Product schemas
ProductSchemas.create
ProductSchemas.update

// Order schemas
OrderSchemas.create

// Review schemas
ReviewSchemas.create
```

#### Usage:
```typescript
import { validateInput, UserSchemas } from '@/lib/validation';

// Validate and sanitize input
const result = await validateInput(UserSchemas.register, request.body);

if (!result.success) {
  return reply.code(400).send({ errors: result.errors });
}

// Use sanitized data
const user = await createUser(result.data);
```

---

### 5. SQL Injection Prevention

**Implemented Through:**

1. **Prisma ORM:** Parameterized queries by default
2. **Input Sanitization:** All user input sanitized before use
3. **Validation:** Zod schemas validate all inputs
4. **Type Safety:** TypeScript ensures type correctness

**Best Practices Enforced:**
```typescript
// ✅ SAFE: Parameterized query
await prisma.user.findMany({
  where: { email: sanitizedEmail }
});

// ✅ SAFE: With validation
const { email } = await validateInput(schema, input);
await prisma.user.findUnique({ where: { email } });

// ❌ AVOID: Raw queries (use only when necessary)
// If raw queries are needed, use Sanitizer.sql()
```

---

### 6. Password Security

**Location:** `apps/backend/src/services/password-security.service.ts`

Comprehensive password security implementation:

#### Features:
- **Bcrypt Hashing:** 12 rounds (configurable)
- **Password Strength Validation:**
  - Minimum 8 characters
  - Requires: uppercase, lowercase, number, special character
  - Checks for common patterns (123, password, admin, qwerty)
  - Scoring system (0-5)

- **Account Lockout:**
  - Max 5 failed attempts
  - 15-minute lockout period
  - Automatic unlock after timeout
  - Failed attempt tracking

- **Password History:**
  - Prevents password reuse
  - Configurable history size (default: 5)

- **Password Reset:**
  - Secure token generation (32 bytes)
  - 1-hour expiration
  - One-time use tokens

#### Usage:
```typescript
import { PasswordSecurityService } from '@/services/password-security.service';

// Hash password
const hashed = await PasswordSecurityService.hashPassword(password);

// Verify password
const isValid = await PasswordSecurityService.verifyPassword(
  password,
  hashedPassword
);

// Check strength
const strength = PasswordSecurityService.checkPasswordStrength(password);
// Returns: { score: 0-5, feedback: string[] }

// Change password
const result = await PasswordSecurityService.changePassword(
  userId,
  currentPassword,
  newPassword
);

// Check if account is locked
const isLocked = await PasswordSecurityService.isAccountLocked(userId);
```

---

## 🔒 GDPR Compliance Features

### 1. Cookie Consent

**Location:** `apps/frontend/src/components/CookieConsent.tsx`

GDPR-compliant cookie consent banner:

#### Features:
- **Granular Consent:**
  - Necessary cookies (always on)
  - Analytics cookies (opt-in)
  - Marketing cookies (opt-in)

- **User Controls:**
  - Accept all
  - Reject all
  - Customizable preferences
  - Persistent storage (localStorage)

- **Privacy-First:**
  - No tracking before consent
  - Easy consent withdrawal
  - Links to Privacy Policy

#### Usage:
```tsx
import { CookieConsent } from '@/components/CookieConsent';

// In your layout
<CookieConsent />

// Access preferences
import { useCookiePreferences } from '@/components/CookieConsent';

const preferences = useCookiePreferences();
// { necessary: true, analytics: boolean, marketing: boolean }
```

---

### 2. Data Export (Right to Access)

**Location:** `apps/backend/src/services/gdpr.service.ts`

Allows users to download all their personal data:

#### Exported Data:
- Personal information (name, email, phone)
- Account details (created date, last login)
- Order history (all orders and items)
- Product reviews
- Shopping cart
- Wishlist

#### Usage:
```bash
# API Endpoint
GET /api/gdpr/export
Authorization: Bearer {token}

# Returns JSON file with all user data
```

#### Data Format:
```json
{
  "exportDate": "2024-01-15T10:30:00Z",
  "dataRetentionPolicy": "...",
  "personalInformation": { ... },
  "orders": [ ... ],
  "reviews": [ ... ],
  "cart": { ... },
  "wishlist": { ... }
}
```

---

### 3. Right to Deletion (Right to be Forgotten)

**Location:** `apps/backend/src/services/gdpr.service.ts`

Compliant account deletion with grace period:

#### Features:
- **30-Day Grace Period:** Users can cancel deletion
- **Data Anonymization:** Instead of hard delete
- **Referential Integrity:** Maintains database consistency
- **Selective Deletion:**
  - Deletes: Cart, wishlist, personal data
  - Anonymizes: Reviews (keeps ratings)
  - Retains: Orders (legal requirement for 7 years)

#### Process:
1. User requests deletion
2. Checks for pending orders
3. Schedules deletion (30-day grace period)
4. User can cancel within grace period
5. Automated deletion after period

#### Usage:
```bash
# Request deletion
POST /api/gdpr/delete-account
{
  "confirmEmail": "user@example.com",
  "reason": "Optional reason"
}

# Cancel deletion
POST /api/gdpr/cancel-deletion
```

#### What Gets Deleted:
```typescript
// Hard deleted
- Shopping cart
- Wishlist

// Anonymized
- Email → deleted-{userId}@anonymized.local
- Name → Deleted User {shortId}
- Phone → null
- Reviews → comment removed, rating kept

// Retained (legal requirement)
- Orders (anonymized)
- Transaction history
```

---

### 4. Data Processing Information

**Location:** `apps/backend/src/controllers/gdpr.controller.ts`

Transparent data processing disclosure:

#### Endpoint:
```bash
GET /api/gdpr/data-info
```

#### Information Provided:
- What data we collect
- How we use the data
- Legal basis for processing
- Data retention periods
- Third-party sharing
- User rights under GDPR

---

### 5. Privacy Policy Page

**Location:** `apps/frontend/src/app/privacy-policy/page.tsx`

Comprehensive GDPR-compliant privacy policy covering:

1. Introduction and scope
2. Information collected
3. How information is used
4. Legal basis for processing (GDPR)
5. Data sharing practices
6. Data retention periods
7. User rights (access, rectification, erasure, etc.)
8. Cookie policy
9. Data security measures
10. International data transfers
11. Children's privacy
12. Policy updates
13. Contact information
14. Right to lodge complaints

---

### 6. Terms of Service Page

**Location:** `apps/frontend/src/app/terms-of-service/page.tsx`

Legal terms covering:

1. Agreement to terms
2. Eligibility
3. Account registration
4. Purchases and payments
5. Shipping and delivery
6. Returns and refunds
7. User conduct
8. Intellectual property
9. User-generated content
10. Disclaimers
11. Limitation of liability
12. Indemnification
13. Termination
14. Governing law
15. Dispute resolution
16. Changes to terms
17. Contact information

---

## 🚀 Setup & Configuration

### Step 1: Install Dependencies

```bash
cd apps/backend
npm install @fastify/rate-limit @fastify/csrf-protection @fastify/helmet bcryptjs zod validator isomorphic-dompurify

cd ../frontend
npm install # No additional dependencies needed
```

### Step 2: Environment Variables

Add to `apps/backend/.env`:
```env
# CSRF Protection
CSRF_SECRET=your-csrf-secret-32-characters-min

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Session Secret (if using sessions)
SESSION_SECRET=your-session-secret-32-characters-min
```

### Step 3: Database Migration

Update Prisma schema to add security fields:

```prisma
model User {
  // ... existing fields
  
  // Security fields
  failedLoginAttempts Int? @default(0)
  lockedUntil DateTime?
  lastLoginAt DateTime?
  passwordChangedAt DateTime?
  
  // GDPR fields
  deletedAt DateTime?
  scheduledDeletionAt DateTime?
}
```

Run migration:
```bash
cd apps/backend
npx prisma migrate dev --name add_security_fields
```

### Step 4: Register Middleware

Edit `apps/backend/src/server.ts`:

```typescript
import { registerGlobalRateLimit } from './middleware/rate-limit.middleware';
import { registerCsrfProtection } from './middleware/csrf.middleware';
import { registerSecurityHeaders, corsConfig } from './middleware/security-headers.middleware';
import cors from '@fastify/cors';

// Register plugins
await registerSecurityHeaders(server);
await server.register(cors, corsConfig);
await registerGlobalRateLimit(server);
// await registerCsrfProtection(server); // Enable if using cookie-based auth
```

### Step 5: Register GDPR Routes

Edit `apps/backend/src/server.ts`:

```typescript
import { gdprRoutes } from './routes/gdpr.routes';

// Register routes
await server.register(gdprRoutes, { prefix: '/api/gdpr' });
```

### Step 6: Add Cookie Consent to Frontend

Edit `apps/frontend/src/app/layout.tsx`:

```tsx
import { CookieConsent } from '@/components/CookieConsent';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
```

---

## 🔐 Security Best Practices

### 1. API Endpoint Security Checklist

- [ ] Rate limiting applied
- [ ] Input validation with Zod schemas
- [ ] Authentication required (where applicable)
- [ ] Authorization checks (role-based)
- [ ] Input sanitization
- [ ] Error messages don't reveal sensitive info
- [ ] Logging for security events

### 2. Password Security Checklist

- [ ] Strong password requirements enforced
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] Account lockout after failed attempts
- [ ] Password change requires current password
- [ ] Password reset tokens expire (1 hour)
- [ ] No password reuse

### 3. GDPR Compliance Checklist

- [ ] Cookie consent banner implemented
- [ ] Privacy policy page published
- [ ] Terms of service page published
- [ ] Data export functionality available
- [ ] Account deletion with grace period
- [ ] Data processing information accessible
- [ ] User rights clearly communicated

### 4. Regular Security Tasks

**Daily:**
- Monitor failed login attempts
- Review error logs for anomalies

**Weekly:**
- Review rate limit violations
- Check for suspicious user activity
- Process scheduled account deletions

**Monthly:**
- Security audit of new features
- Review and update security policies
- Test backup and recovery procedures

**Quarterly:**
- Update dependencies
- Review and update CSP headers
- Penetration testing
- Privacy policy review

---

## 📊 Monitoring & Alerts

### Security Events to Monitor:

1. **Authentication:**
   - Failed login attempts
   - Account lockouts
   - Password changes
   - Password reset requests

2. **Rate Limiting:**
   - Rate limit violations
   - Repeated violations from same IP/user

3. **Data Access:**
   - Data export requests
   - Account deletion requests
   - Bulk data access

4. **Suspicious Activity:**
   - Multiple accounts from same IP
   - Rapid account creation
   - Unusual purchase patterns

### Logging Example:

```typescript
import { logger } from '@/lib/logger';

// Security events
logger.warn({
  event: 'account_locked',
  userId: user.id,
  attempts: 5,
  ip: request.ip,
}, 'Account locked due to failed login attempts');

// GDPR events
logger.info({
  event: 'data_export',
  userId: user.id,
}, 'User data exported');
```

---

## 🧪 Testing Security Features

### 1. Rate Limiting Test

```bash
# Test auth rate limit (should fail after 5 attempts)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

### 2. Input Validation Test

```bash
# Test XSS prevention
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "<script>alert(\"XSS\")</script>",
    "description": "Test"
  }'
# Should return validation error or sanitized output
```

### 3. CSRF Protection Test

```bash
# Should fail without CSRF token
curl -X POST http://localhost:3000/api/form-endpoint \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}'
# Expected: 403 Forbidden
```

### 4. Security Headers Test

```bash
# Check headers
curl -I http://localhost:3000

# Should include:
# - Strict-Transport-Security
# - X-Content-Type-Options: nosniff
# - X-Frame-Options: DENY
# - Content-Security-Policy
```

### 5. GDPR Features Test

```bash
# Test data export
curl -X GET http://localhost:3000/api/gdpr/export \
  -H "Authorization: Bearer TOKEN"
# Should return JSON with all user data

# Test account deletion request
curl -X POST http://localhost:3000/api/gdpr/delete-account \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"confirmEmail":"user@example.com"}'
# Should schedule deletion
```

---

## 🚨 Security Incident Response

If a security incident occurs:

1. **Immediate Actions:**
   - Identify and isolate affected systems
   - Preserve evidence (logs, database state)
   - Assess scope and impact

2. **Containment:**
   - Revoke compromised credentials
   - Block malicious IPs
   - Apply emergency patches

3. **Recovery:**
   - Restore from clean backups
   - Reset affected user passwords
   - Update security measures

4. **Notification:**
   - Notify affected users (GDPR requires within 72 hours)
   - Report to authorities if required
   - Document incident

5. **Post-Incident:**
   - Conduct root cause analysis
   - Update security policies
   - Implement preventive measures

---

## 📚 Additional Resources

### Security Standards:
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **GDPR Official Text:** https://gdpr-info.eu/
- **PCI DSS:** For payment processing
- **ISO 27001:** Information security management

### Tools:
- **Security Scanning:** Snyk, npm audit
- **SAST:** SonarQube, ESLint security plugins
- **DAST:** OWASP ZAP, Burp Suite
- **Dependency Checking:** Dependabot, Renovate

### Penetration Testing:
- Consider hiring professional security auditors
- Regular automated security scans
- Bug bounty program for larger applications

---

## ✅ Phase 11 Complete!

**All security and compliance features have been successfully implemented:**

✅ Rate limiting (API protection)  
✅ CSRF protection  
✅ XSS protection headers  
✅ Input validation/sanitization  
✅ SQL injection prevention  
✅ Secure password policies  
✅ GDPR cookie consent  
✅ Privacy policy page  
✅ Terms of service  
✅ Data export functionality  
✅ Right to deletion  
✅ Comprehensive documentation  

**Your application is now production-ready from a security and compliance perspective!**

**Next Steps:**
- Phase 12: Performance & Optimization
- Regular security audits
- Stay updated with security best practices
- Monitor security logs daily

---

## 📞 Support

For security concerns or questions:
- Review this documentation
- Check OWASP guidelines
- Consult security professionals for production deployments
- Keep all dependencies updated

**Remember:** Security is an ongoing process, not a one-time implementation!
