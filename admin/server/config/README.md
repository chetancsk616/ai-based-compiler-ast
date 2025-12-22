# Firebase Service Account Key

Place your Firebase service account key file here as `serviceAccountKey.json`.

## How to Get Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (Settings) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded file as `serviceAccountKey.json` in this directory

## ⚠️ Security Warning

**NEVER commit this file to version control!**

It's already in `.gitignore`, but double-check before committing.

## Alternative: Environment Variable

Instead of using a file, you can set the `FIREBASE_SERVICE_ACCOUNT` environment variable with the entire JSON content:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"..."}
```

This is recommended for production deployments.
