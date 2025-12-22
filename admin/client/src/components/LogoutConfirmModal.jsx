export default function LogoutConfirmModal({ show, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
      style={{ zIndex: 90 }}
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">👋</span>
          <h2 className="text-2xl font-bold text-gray-800">Logout?</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-bold transition-all"
          >
            ✓ Logout
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-700 rounded-lg font-semibold"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
