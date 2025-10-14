# Google OAuth Full-Page Redirect Flow

## Overview
The Google OAuth authentication now uses a **full-page redirect** instead of popups. When a user clicks "Continue with Google", they are redirected to Google's login page in the **same window**, and after successful authentication, they return to the main app already logged in.

## How It Works

### 1. User Clicks "Continue with Google"
- **Location**: Login or Register page
- **Action**: `loginWithGoogle()` is called
- **Result**: Browser redirects to `http://localhost:3001/api/auth/google`

### 2. Backend Initiates Google OAuth
- **Endpoint**: `GET /api/auth/google`
- **Controller**: `GoogleAuthController.initiateGoogleAuth()`
- **Action**: Redirects user to Google's OAuth consent screen

### 3. User Authenticates with Google
- User logs in with their Google account
- User grants permissions to the app
- Google redirects back to: `http://localhost:3001/api/auth/google/callback?code=...`

### 4. Backend Processes OAuth Callback
- **Endpoint**: `GET /api/auth/google/callback`
- **Controller**: `GoogleAuthController.handleGoogleCallback()`
- **Actions**:
  1. Exchanges authorization code for Google tokens
  2. Retrieves user info from Google
  3. Creates new user OR finds existing user in database
  4. Generates JWT access and refresh tokens
  5. Redirects to frontend callback: `http://localhost:3000/auth/google/callback?user=...&accessToken=...&refreshToken=...`

### 5. Frontend Callback Page Processes Tokens
- **Location**: `/auth/google/callback` page
- **File**: `frontend/src/app/auth/google/callback/page.tsx`
- **Actions**:
  1. Extracts tokens and user data from URL query params
  2. Saves to localStorage:
     - `accessToken`
     - `refreshToken`
     - `user` (JSON)
  3. Shows success message with spinner
  4. Redirects to home page (`/`) after 1 second

### 6. User Lands on Home Page (Logged In)
- **AuthContext** automatically loads tokens from localStorage
- User sees their account icon and is fully authenticated
- All API calls include the JWT token

## Code Changes

### Frontend

#### `AuthContext.tsx`
```typescript
const loginWithGoogle = async () => {
  // Simple redirect - no popup logic
  window.location.href = `${API_URL}/api/auth/google`;
};
```

#### `login/page.tsx` & `register/page.tsx`
- Removed popup message listeners
- Simplified Google button handler:
```typescript
const handleGoogleLogin = () => {
  loginWithGoogle(); // Just trigger redirect
};
```

#### `auth/google/callback/page.tsx`
- Extract tokens from URL params
- Save to localStorage
- Redirect to home page
- Display loading/success/error states

### Backend

#### `google-auth.controller.ts`
- **`handleGoogleCallback()`**: Now uses direct `reply.redirect()` instead of HTML with popup messaging
- On success: Redirects to `/auth/google/callback` with tokens in URL
- On error: Redirects to `/login?error=google_auth_failed`

## Flow Diagram

```
User (Login Page)
    ↓ Click "Continue with Google"
Backend (/api/auth/google)
    ↓ Redirect to Google
Google OAuth Consent Screen
    ↓ User logs in & grants permissions
Backend (/api/auth/google/callback)
    ↓ Create/find user, generate tokens
Frontend (/auth/google/callback)
    ↓ Save tokens to localStorage
    ↓ Show success message
Home Page (/)
    ✓ User is logged in
```

## Benefits of Full-Page Redirect

1. **No Popup Blockers**: Works on all browsers without popup issues
2. **Simpler Code**: No complex popup/parent window communication
3. **Better UX**: Users stay in the same window throughout
4. **Mobile Friendly**: Works seamlessly on mobile devices
5. **Standard OAuth Flow**: Follows OAuth 2.0 best practices

## Environment Variables

Make sure these are set in your backend `.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

## Testing

1. Start backend: `npm run dev` (from `apps/backend`)
2. Start frontend: `npm run dev` (from `apps/frontend`)
3. Go to `http://localhost:3000/login`
4. Click "Continue with Google"
5. Verify:
   - Redirects to Google login
   - After login, redirects to callback page
   - Callback page shows success message
   - Redirects to home page
   - User icon appears in header (logged in state)

## Troubleshooting

### Issue: "Authentication failed - missing credentials"
- **Cause**: Backend didn't pass tokens properly
- **Fix**: Check backend logs, ensure Google OAuth setup is correct

### Issue: Stuck on callback page
- **Cause**: Frontend callback page isn't redirecting
- **Fix**: Check browser console for errors, verify localStorage access

### Issue: Home page doesn't show logged-in state
- **Cause**: Tokens not in localStorage OR AuthContext not loading them
- **Fix**: Check localStorage in DevTools, verify AuthContext useEffect runs

## Security Notes

- Tokens are passed via URL query params (HTTPS required in production)
- Tokens are immediately saved to localStorage and URL is not stored in history
- JWT tokens have expiration times (access token: 15min, refresh token: 7 days)
- All API requests require Bearer token authentication

## Production Considerations

1. **Use HTTPS**: Never use this flow over HTTP in production
2. **Update URLs**: Change `localhost:3000` and `localhost:3001` to production URLs
3. **Environment Variables**: Set proper `FRONTEND_URL` and `GOOGLE_REDIRECT_URI`
4. **Google Console**: Update authorized redirect URIs in Google Cloud Console
5. **CORS**: Ensure backend allows frontend origin
