import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '380px',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)',
              borderLeft: `5px solid ${
                toast.type === 'success'
                  ? '#10b981'
                  : toast.type === 'error'
                  ? '#ef4444'
                  : toast.type === 'warning'
                  ? '#f59e0b'
                  : '#0ea5e9'
              }`,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {toast.type === 'success' && <CheckCircle size={20} color="#10b981" />}
            {toast.type === 'error' && <XCircle size={20} color="#ef4444" />}
            {toast.type === 'warning' && <AlertTriangle size={20} color="#f59e0b" />}
            {toast.type === 'info' && <Info size={20} color="#0ea5e9" />}

            <div style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: '#94a3b8', padding: '2px', display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
