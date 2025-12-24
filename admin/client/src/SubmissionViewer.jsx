import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { API_BASE_URL } from './config';

const SubmissionViewer = () => {
  const { user, getIdToken } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filters, setFilters] = useState({
    userId: '',
    questionId: '',
    minScore: '',
    maxScore: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = await (getIdToken ? getIdToken() : user.getIdToken());
      const params = new URLSearchParams(filters);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/submissions?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewSubmission = async (submissionId) => {
    try {
      const token = await (getIdToken ? getIdToken() : user.getIdToken());
      const response = await fetch(`${API_BASE_URL}/api/admin/submissions/${submissionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch submission');
      
      const data = await response.json();
      setSelectedSubmission(data.submission || data);
    } catch (err) {
      alert('Error loading submission: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Submission Viewer</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/admin/questions')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              📝 Questions
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              👥 Users
            </button>
            <button 
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="User ID"
            value={filters.userId}
            onChange={(e) => setFilters({...filters, userId: e.target.value})}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Question ID"
            value={filters.questionId}
            onChange={(e) => setFilters({...filters, questionId: e.target.value})}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Min Score"
            value={filters.minScore}
            onChange={(e) => setFilters({...filters, minScore: e.target.value})}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Max Score"
            value={filters.maxScore}
            onChange={(e) => setFilters({...filters, maxScore: e.target.value})}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            🔍 Apply Filters
          </button>
        </div>

        {/* Submissions Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <p className="text-gray-400">
              {submissions.length === 0 
                ? 'No submissions found. Connect Firestore to view actual submissions.' 
                : `Showing ${submissions.length} submissions`}
            </p>
          </div>
          
          {submissions.length > 0 && (
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Question</th>
                  <th className="px-6 py-3 text-left">Language</th>
                  <th className="px-6 py-3 text-left">Score</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-6 py-4 font-mono text-sm">{sub.id?.slice(0, 8)}</td>
                    <td className="px-6 py-4">{sub.userEmail}</td>
                    <td className="px-6 py-4">{sub.questionTitle}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-700 rounded text-sm">
                        {sub.language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        sub.score >= 80 ? 'text-green-400' :
                        sub.score >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {sub.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(sub.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => viewSubmission(sub.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
};

// Submission Detail Modal
const SubmissionModal = ({ submission, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Submission Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="Score" value={`${submission.score}%`} />
            <InfoCard label="Decision" value={submission.decision} />
            <InfoCard label="Language" value={submission.language} />
            <InfoCard label="Duration" value={`${submission.totalDurationMs}ms`} />
          </div>

          {/* Code */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Submitted Code</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language={submission.language}
                style={atomOneDark}
                customStyle={{ margin: 0, padding: '1rem' }}
              >
                {submission.code || 'No code available'}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Verdict Details */}
          {submission.finalVerdict && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Verdict</h3>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <p><strong>Reasoning:</strong> {submission.finalVerdict.reasoning}</p>
                <p><strong>Trust Score:</strong> {submission.finalVerdict.trustScore}%</p>
              </div>
            </div>
          )}

          {/* Test Results */}
          {submission.testResults && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Test Results</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <p>Passed: {submission.testResults.passedTests}/{submission.testResults.totalTests}</p>
                {submission.testResults.results?.map((test, i) => (
                  <div key={i} className={`mt-2 p-2 rounded ${test.passed ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                    <p>Test {test.testNumber}: {test.passed ? '✓' : '✗'}</p>
                    {!test.passed && test.error && <p className="text-sm text-red-300">{test.error}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-gray-700 rounded-lg p-4">
    <p className="text-sm text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default SubmissionViewer;

