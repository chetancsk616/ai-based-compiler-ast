/**
 * Permission Manager
 * Handles granular user permissions in the database
 */

const { adminAuth: admin } = require('../middleware/adminAuth');

/**
 * Available permissions that can be granted to users
 */
const PERMISSIONS = {
  // Question permissions
  canReadQuestions: { label: 'Read Questions', description: 'View all questions in the system' },
  canWriteQuestions: { label: 'Write Questions', description: 'Create, edit, and delete questions' },
  
  // Submission permissions
  canReadAllSubmissions: { label: 'Read All Submissions', description: 'View submissions from all users' },
  canEvaluateSubmissions: { label: 'Evaluate Submissions', description: 'Score and evaluate user submissions' },
  
  // User management permissions
  canManageUsers: { label: 'Manage Users', description: 'View and manage user accounts' },
  canGrantPermissions: { label: 'Grant Permissions', description: 'Grant/revoke permissions to other users (restricted to non-admin permissions)' },
  
  // System permissions
  canViewAuditLogs: { label: 'View Audit Logs', description: 'Access system audit logs' },
  canExportData: { label: 'Export Data', description: 'Export questions, submissions, and reports' },
};

/**
 * Default permissions for different user types
 */
const DEFAULT_PERMISSIONS = {
  admin: {
    canReadQuestions: true,
    canWriteQuestions: true,
    canReadAllSubmissions: true,
    canEvaluateSubmissions: true,
    canManageUsers: true,
    canGrantPermissions: true,
    canViewAuditLogs: true,
    canExportData: true,
  },
  teacher: {
    canReadQuestions: true,
    canWriteQuestions: false,
    canReadAllSubmissions: true,
    canEvaluateSubmissions: true,
    canManageUsers: false,
    canGrantPermissions: false,
    canViewAuditLogs: false,
    canExportData: true,
  },
  student: {
    canReadQuestions: true,
    canWriteQuestions: false,
    canReadAllSubmissions: false,
    canEvaluateSubmissions: false,
    canManageUsers: false,
    canGrantPermissions: false,
    canViewAuditLogs: false,
    canExportData: false,
  },
};

function getDb() {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.database();
}

/**
 * Get permissions for a specific user
 */
async function getUserPermissions(userId) {
  try {
    const snap = await getDb().ref(`userPermissions/${userId}`).once('value');
    const permissions = snap.val() || {};
    
    // Check if user is admin
    const userRecord = await admin.auth().getUser(userId);
    const isAdmin = userRecord.customClaims?.role === 'admin';
    
    return {
      userId,
      isAdmin,
      permissions: isAdmin ? DEFAULT_PERMISSIONS.admin : permissions,
    };
  } catch (error) {
    console.error('Error getting user permissions:', error);
    throw error;
  }
}

/**
 * Set permissions for a user
 */
async function setUserPermissions(userId, permissions, adminUserId) {
  try {
    // Validate permissions
    const validPermissions = {};
    for (const [key, value] of Object.entries(permissions)) {
      if (PERMISSIONS[key] !== undefined) {
        validPermissions[key] = Boolean(value);
      }
    }
    
    // Save to database
    await getDb().ref(`userPermissions/${userId}`).set({
      ...validPermissions,
      updatedBy: adminUserId,
      updatedAt: new Date().toISOString(),
    });
    
    // Log the action
    await logPermissionChange(userId, validPermissions, adminUserId);
    
    return validPermissions;
  } catch (error) {
    console.error('Error setting user permissions:', error);
    throw error;
  }
}

/**
 * Grant a specific permission to a user
 */
async function grantPermission(userId, permissionKey, adminUserId) {
  try {
    if (!PERMISSIONS[permissionKey]) {
      throw new Error(`Invalid permission: ${permissionKey}`);
    }
    
    const currentPermissions = await getUserPermissions(userId);
    const updatedPermissions = {
      ...currentPermissions.permissions,
      [permissionKey]: true,
    };
    
    return await setUserPermissions(userId, updatedPermissions, adminUserId);
  } catch (error) {
    console.error('Error granting permission:', error);
    throw error;
  }
}

/**
 * Revoke a specific permission from a user
 */
async function revokePermission(userId, permissionKey, adminUserId) {
  try {
    if (!PERMISSIONS[permissionKey]) {
      throw new Error(`Invalid permission: ${permissionKey}`);
    }
    
    const currentPermissions = await getUserPermissions(userId);
    const updatedPermissions = {
      ...currentPermissions.permissions,
      [permissionKey]: false,
    };
    
    return await setUserPermissions(userId, updatedPermissions, adminUserId);
  } catch (error) {
    console.error('Error revoking permission:', error);
    throw error;
  }
}

/**
 * Apply a permission preset (student, teacher, admin)
 */
async function applyPermissionPreset(userId, presetName, adminUserId) {
  try {
    if (!DEFAULT_PERMISSIONS[presetName]) {
      throw new Error(`Invalid preset: ${presetName}`);
    }
    
    return await setUserPermissions(userId, DEFAULT_PERMISSIONS[presetName], adminUserId);
  } catch (error) {
    console.error('Error applying permission preset:', error);
    throw error;
  }
}

/**
 * Check if a user has a specific permission
 */
async function hasPermission(userId, permissionKey) {
  try {
    const userPermissions = await getUserPermissions(userId);
    
    // Admins have all permissions
    if (userPermissions.isAdmin) {
      return true;
    }
    
    return userPermissions.permissions[permissionKey] === true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Log permission changes to audit log
 */
async function logPermissionChange(userId, permissions, adminUserId) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: 'PERMISSION_UPDATE',
      adminUserId,
      targetUserId: userId,
      permissions,
    };
    
    await getDb().ref('auditLogs').push(logEntry);
  } catch (error) {
    console.error('Error logging permission change:', error);
  }
}

/**
 * Get all users with their permissions
 */
async function getAllUsersWithPermissions(maxUsers = 500) {
  try {
    const users = [];
    let nextPageToken;
    
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      
      for (const userRecord of result.users) {
        if (users.length < maxUsers) {
          const permissions = await getUserPermissions(userRecord.uid);
          
          users.push({
            id: userRecord.uid,
            email: userRecord.email || 'unknown',
            name: userRecord.displayName || userRecord.email?.split('@')[0] || 'N/A',
            isAdmin: permissions.isAdmin,
            permissions: permissions.permissions,
            createdAt: userRecord.metadata?.creationTime || null,
            lastSignInAt: userRecord.metadata?.lastSignInTime || null,
            disabled: Boolean(userRecord.disabled),
          });
        }
      }
      
      nextPageToken = result.pageToken;
    } while (nextPageToken && users.length < maxUsers);
    
    return users;
  } catch (error) {
    console.error('Error getting all users with permissions:', error);
    throw error;
  }
}

module.exports = {
  PERMISSIONS,
  DEFAULT_PERMISSIONS,
  getUserPermissions,
  setUserPermissions,
  grantPermission,
  revokePermission,
  applyPermissionPreset,
  hasPermission,
  getAllUsersWithPermissions,
};
