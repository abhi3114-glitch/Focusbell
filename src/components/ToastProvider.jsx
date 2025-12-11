import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[200px] px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border border-white/10 text-sm font-medium animate-slide-up flex items-center gap-3
                            ${toast.type === 'success' ? 'bg-green-500/20 text-green-100' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/20 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-gray-800/90 text-white' : ''}
                        `}
                    >
                        {toast.type === 'success' && <span className="text-green-400">✓</span>}
                        {toast.type === 'error' && <span className="text-red-400">✕</span>}
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
