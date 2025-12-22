import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, getIdToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = await (getIdToken ? getIdToken() : user.getIdToken());
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access denied. Admin privileges required.');
          return;
        }
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 text-blue-400 hover:text-blue-300 underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Questions" 
            value={stats?.totalQuestions || 0}
            icon="📚"
            color="blue"
          />
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0}
            icon="👥"
            color="green"
          />
          <StatCard 
            title="Total Submissions" 
            value={stats?.totalSubmissions || 0}
            icon="📝"
            color="purple"
          />
          <StatCard 
            title="Average Score" 
            value={stats?.averageScore || 0}
            icon="⭐"
            color="yellow"
            suffix="%"
          />
        </div>

        {/* Questions by Difficulty */}
        {stats?.questionsByDifficulty && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Questions by Difficulty</h2>
            <div className="grid grid-cols-3 gap-4">
              <DifficultyCard 
                level="Easy" 
                count={stats.questionsByDifficulty.Easy}
                color="green"
              />
              <DifficultyCard 
                level="Medium" 
                count={stats.questionsByDifficulty.Medium}
                color="yellow"
              />
              <DifficultyCard 
                level="Hard" 
                count={stats.questionsByDifficulty.Hard}
                color="red"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton 
              title="Manage Questions"
              description="Add, edit, or delete questions"
              icon="📝"
              onClick={() => navigate('/admin/questions')}
            />
            <ActionButton 
              title="View Submissions"
              description="Browse all user submissions"
              icon="📊"
              onClick={() => navigate('/admin/submissions')}
            />
            <ActionButton 
              title="Manage Users"
              description="View and manage user accounts"
              icon="👤"
              onClick={() => navigate('/admin/users')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {stats?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, suffix = '' }) => {
  const colorClasses = {
    blue: 'bg-blue-900/30 border-blue-500',
    green: 'bg-green-900/30 border-green-500',
    purple: 'bg-purple-900/30 border-purple-500',
    yellow: 'bg-yellow-900/30 border-yellow-500'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}{suffix}</p>
    </div>
  );
};

// Difficulty Card Component
const DifficultyCard = ({ level, count, color }) => {
  const colorClasses = {
    green: 'bg-green-900/30 border-green-500 text-green-400',
    yellow: 'bg-yellow-900/30 border-yellow-500 text-yellow-400',
    red: 'bg-red-900/30 border-red-500 text-red-400'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4 text-center`}>
      <p className="text-sm font-medium mb-1">{level}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 text-left transition-all transform hover:scale-105"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default AdminDashboard;
