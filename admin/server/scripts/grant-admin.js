// Admin Setup Utility
// Run this script to grant admin access to a user by their email
// Usage: node scripts/grant-admin.js <email>
// Example: node scripts/grant-admin.js srinivaschetan7@gmail.com

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Initialize Firebase Admin
try {
  let credential;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Use plain JSON environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    // Use base64-encoded environment variable
    const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Use file
    const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');
    credential = admin.credential.cert(require(serviceAccountPath));
  }
  
  admin.initializeApp({
    credential: credential
  });
  
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  console.error('\nMake sure you have either:');
  console.error('1. FIREBASE_SERVICE_ACCOUNT environment variable (plain JSON), OR');
  console.error('2. FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable (base64 encoded), OR');
  console.error('3. server/config/serviceAccountKey.json file');
  process.exit(1);
}

async function grantAdminAccess(emailOrUid) {
  try {
    console.log(`\nLooking up user: ${emailOrUid}`);
    
    // Try to get user by email first, fallback to UID
    let user;
    try {
      user = await admin.auth().getUserByEmail(emailOrUid);
      console.log(`✅ Found user by email: ${user.email} (UID: ${user.uid})`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Maybe it's a UID instead
        user = await admin.auth().getUser(emailOrUid);
        console.log(`✅ Found user by UID: ${user.email}`);
      } else {
        throw error;
      }
    }
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log('\n🎉 Admin access granted successfully!');
    console.log('The user needs to:');
    console.log('1. Logout and login again (or call getIdToken(true))');
    console.log('2. Navigate to /admin');
    console.log(`\nAdmin user: ${user.email} (${user.uid})`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Error granting admin access:', error.message);
    return false;
  }
}

async function revokeAdminAccess(uid) {
  try {
    console.log(`\nRevoking admin access from user: ${uid}`);
    
    // Get user details
    const user = await admin.auth().getUser(uid);
    console.log(`User found: ${user.email}`);
    
    // Remove custom claim
    await admin.auth().setCustomUserClaims(uid, { admin: false });
    
    console.log('\n✅ Admin access revoked successfully!');
    console.log(`User: ${user.email} (${uid})`);
    
    return true;
  } catch (error) {
    console.error('\n❌ Error revoking admin access:', error.message);
    return false;
  }
}

async function listAllUsers() {
  try {
    console.log('\nFetching all users...\n');
    
    const listUsersResult = await admin.auth().listUsers(100);
    
    console.log(`Total users: ${listUsersResult.users.length}\n`);
    console.log('UID                          | Email                        | Admin');
    console.log('-'.repeat(80));
    
    listUsersResult.users.forEach((user) => {
      const isAdmin = user.customClaims?.admin === true;
      const uid = user.uid.padEnd(28);
      const email = (user.email || 'No email').padEnd(28);
      console.log(`${uid} | ${email} | ${isAdmin ? '✓ Yes' : '✗ No'}`);
    });
    
    console.log('\nTo grant admin access: node scripts/grant-admin.js <uid>');
    console.log('To revoke admin access: node scripts/grant-admin.js revoke <uid>');
    
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('📋 Admin Setup Utility\n');
  console.log('Usage:');
  console.log('  node scripts/grant-admin.js <email|uid>      - Grant admin access');
  console.log('  node scripts/grant-admin.js revoke <uid>      - Revoke admin access');
  console.log('  node scripts/grant-admin.js list              - List all users\n');
  console.log('Example:');
  console.log('  node scripts/grant-admin.js srinivaschetan7@gmail.com\n');
  process.exit(0);
}

const command = args[0];

if (command === 'list') {
  listAllUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else if (command === 'revoke' && args[1]) {
  revokeAdminAccess(args[1])
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  grantAdminAccess(command)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
