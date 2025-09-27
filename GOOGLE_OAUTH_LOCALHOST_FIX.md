# Fix Google OAuth for Localhost

## 🎯 Quick Fix for redirect_uri_mismatch

To make Google OAuth work on localhost, you need to add these exact URIs to your Google Cloud Console:

### Go to Google Cloud Console:
1. Visit: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `166886283256-h9srv9qqn32qls3jfmm2au91vcjq5kt8.apps.googleusercontent.com`
3. Click "Edit" (pencil icon)

### Add these Authorized JavaScript origins:
```
http://localhost:5000
http://127.0.0.1:5000
```

### Add these Authorized redirect URIs:
```
http://localhost:5000
http://127.0.0.1:5000
```

### Save the changes

## 🚀 After Configuration

Once you add these URIs, the Google OAuth will work with:
- ✅ Real Google Account Chooser
- ✅ Your actual Google email and name
- ✅ Proper permissions flow
- ✅ Real Google profile picture

## 🧪 Test Flow

1. Click "Continue with Google"
2. Google popup opens with account chooser
3. Select your Google account
4. Grant permissions to AquaSutra
5. Automatic login with your real Google data

The code is already updated to handle this properly!
