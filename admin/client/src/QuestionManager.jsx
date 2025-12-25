import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import { API_BASE_URL } from './config';

const QuestionManager = () => {
  const { user, getIdToken, logout } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [difficultyFilter]);

  const fetchQuestions = async () => {
    try {
      const token = await (getIdToken ? getIdToken() : user.getIdToken());
      const params = new URLSearchParams();
      if (difficultyFilter) params.append('difficulty', difficultyFilter);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/questions?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      const normalized = (data.questions || []).map((q) => ({
        ...q,
        requiresHiddenTests: q?.requiresHiddenTests !== false,
      }));
      setQuestions(normalized);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setShowModal(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowModal(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const token = await (getIdToken ? getIdToken() : user.getIdToken());
      const response = await fetch(`${API_BASE_URL}/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete question');
      
      fetchQuestions();
    } catch (err) {
      alert('Error deleting question: ' + err.message);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <LogoutConfirmModal
        show={showLogoutConfirm}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Question Management</h1>
          <div className="flex gap-3">
            <button 
              onClick={handleCreateQuestion}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              ➕ Add Question
            </button>
            <button 
              onClick={() => navigate('/admin/submissions')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              📊 View Submissions
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              👥 Manage Users
            </button>
            <button 
              onClick={() => navigate('/admin/permissions')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              🔐 Permissions
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex gap-4">
          <input
            type="text"
            placeholder="🔍 Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Questions Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Difficulty</th>
                <th className="px-6 py-3 text-left">Tags</th>
                <th className="px-6 py-3 text-left">Hidden Tests</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-6 py-4">{q.id}</td>
                  <td className="px-6 py-4 font-medium">{q.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      q.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                      q.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {q.tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        q.requiresHiddenTests !== false
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-yellow-900/30 text-yellow-300'
                      }`}
                    >
                      {q.requiresHiddenTests !== false ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditQuestion(q)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredQuestions.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">
              No questions found
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchQuestions();
          }}
          currentUser={user}
          getIdToken={getIdToken}
        />
      )}
    </div>
  );
};

// Question Modal Component
const QuestionModal = ({ question, onClose, onSave, currentUser, getIdToken }) => {
  const [formData, setFormData] = useState({
    title: question?.title || '',
    description: question?.description || '',
    difficulty: question?.difficulty || 'Medium',
    tags: question?.tags?.join(', ') || '',
    testCases: JSON.stringify(question?.testCases || [], null, 2),
    requiresHiddenTests: question?.requiresHiddenTests !== false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      title: question?.title || '',
      description: question?.description || '',
      difficulty: question?.difficulty || 'Medium',
      tags: question?.tags?.join(', ') || '',
      testCases: JSON.stringify(question?.testCases || [], null, 2),
      requiresHiddenTests: question?.requiresHiddenTests !== false,
    });
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = await (getIdToken ? getIdToken() : currentUser.getIdToken());
      const url = question 
        ? `${API_BASE_URL}/api/admin/questions/${question.id}`
        : `${API_BASE_URL}/api/admin/questions`;
      
      const method = question ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        testCases: JSON.parse(formData.testCases),
        requiresHiddenTests: formData.requiresHiddenTests !== false
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save question');
      
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {question ? 'Edit Question' : 'Create New Question'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="arrays, strings, dynamic-programming"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Require Hidden Testcases?</label>
            <select
              value={formData.requiresHiddenTests ? 'yes' : 'no'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requiresHiddenTests: e.target.value === 'yes',
                })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none"
            >
              <option value="yes">Yes (default)</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test Cases (JSON)</label>
            <textarea
              value={formData.testCases}
              onChange={(e) => setFormData({...formData, testCases: e.target.value})}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm h-48"
              placeholder='[{"input": "5", "expected_output": "120"}]'
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Question'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionManager;

