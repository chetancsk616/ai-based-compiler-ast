import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminDashboard from './pages/AdminDashboard';
import QuestionManager from './pages/QuestionManager';
import SubmissionViewer from './pages/SubmissionViewer';
import UserManager from './pages/UserManager';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { AuthProvider } from './AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
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
