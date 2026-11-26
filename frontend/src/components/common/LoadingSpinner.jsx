import React from 'react';

const LoadingSpinner = ({ message = 'Loading placement data...', height = '250px' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height,
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '4px solid var(--border-light)',
          borderTopColor: 'var(--wine-red)',
          borderRightColor: 'var(--sky-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
