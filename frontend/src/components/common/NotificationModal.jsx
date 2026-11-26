import React, { useState, useEffect } from 'react';
import { X, Bell, AlertCircle, CheckCircle, Info, Flame, Calendar } from 'lucide-react';
import api from '../../services/api';

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/admin/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <Flame size={20} color="#ea580c" />;
      case 'alert':
        return <AlertCircle size={20} color="#ef4444" />;
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      default:
        return <Info size={20} color="#0ea5e9" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--wine-red-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--wine-red)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--wine-red)' }}>
                Placement Notice Board
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official campus drives, alerts & interview schedules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div style={{ padding: '1.25rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading announcements...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Bell size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No active announcements</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Check back later for company visits and exam links.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  style={{
                    padding: '1rem 1.15rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    background: notif.type === 'urgent' ? '#fff7ed' : '#ffffff',
                    borderLeft: `4px solid ${
                      notif.type === 'urgent'
                        ? 'var(--orange)'
                        : notif.type === 'alert'
                        ? '#ef4444'
                        : notif.type === 'success'
                        ? '#10b981'
                        : 'var(--sky-blue)'
                    }`,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {notif.title}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          margin: '0.25rem 0',
                        }}
                      >
                        <span>From: <strong>{notif.senderName || 'Placement Cell'}</strong></span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={12} /> {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: '2.1rem' }}>
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'var(--bg-main)',
          }}
        >
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
