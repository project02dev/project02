# Firebase Firestore Rules Deployment Guide

## Problem Solved

Fixed "Missing or insufficient permissions" errors for like functionality in production environment.

## Changes Made

### 1. Updated Firestore Rules

- **Public Read Access**: Enabled public read access for projects and likes collections
- **Likes Collection**: Added comprehensive rules for likes collection with proper permissions
- **Authentication**: Maintained proper authentication requirements for write operations
- **Security**: Ensured users can only manage their own data

### 2. Environment Configuration

- Updated `NEXT_PUBLIC_BASE_URL` from localhost to production URL

### 3. Deployment Script

- Created automated deployment script for Firestore rules
- Added to package.json as `deploy:firestore` script

## Deployment Instructions

### Prerequisites

1. Install Firebase CLI globally:

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

### Deploy Firestore Rules

**Using the deployment script:**

```bash
npm run deploy:firestore
```

**Manual deployment:**

```bash
firebase deploy --only firestore:rules
```

## Testing

1. Deploy the updated rules
2. Visit your production site
3. Test like functionality as public and authenticated users
4. Verify no permission errors

## Support

If issues persist, check Firebase Console for detailed error logs.
