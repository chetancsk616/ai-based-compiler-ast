import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Verifying admin access...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to unified login at 3000, not local /login
    window.location.href = 'http://localhost:3000/';
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You do not have admin privileges.</p>
          <button
            onClick={() => window.location.href = 'http://localhost:3000/'}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
