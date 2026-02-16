import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Ya, Hapus", cancelText = "Batal", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-scaleIn border border-gray-100 dark:border-gray-700">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <span className="text-2xl">{type === 'danger' ? '⚠️' : 'ℹ️'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
                        {message}
                    </p>
                    <div className="flex space-x-3 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${type === 'danger'
                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
