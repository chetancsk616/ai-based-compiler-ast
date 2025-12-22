import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import QuestionManager from './pages/QuestionManager.jsx';
import SubmissionViewer from './pages/SubmissionViewer.jsx';
import UserManager from './pages/UserManager.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';
import { AuthProvider } from './AuthContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App */}
          <Route path="/*" element={<App />} />
          
          {/* Admin Routes */}
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
