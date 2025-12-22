import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard.jsx';
import QuestionManager from './QuestionManager.jsx';
import SubmissionViewer from './SubmissionViewer.jsx';
import UserManager from './UserManager.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import { AuthProvider } from './AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/questions" 
            element={
              <ProtectedAdminRoute>
                <QuestionManager />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/submissions" 
            element={
              <ProtectedAdminRoute>
                <SubmissionViewer />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedAdminRoute>
                <UserManager />
              </ProtectedAdminRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
