import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  Bell,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  FileText,
  Users,
} from 'lucide-react';
import api from '../../services/api';
import NotificationModal from './NotificationModal';

const Navbar = () => {
  const { user, isAuthenticated, logout, isStudent, isCompany, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    // Fetch notifications count
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/admin/notifications');
        if (res.data.success && res.data.notifications) {
          setUnreadNotifsCount(res.data.notifications.length);
        }
      } catch (err) {
        // quiet fallback
      }
    };
    fetchNotifs();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--wine-red), var(--orange))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(114, 47, 55, 0.25)',
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--wine-red)' }}>Campus</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--sky-blue)' }}>Placement</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Team 4 • S.No. 23 to 29
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link
            to="/jobs"
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive('/jobs') ? 'var(--wine-red)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Briefcase size={18} />
            Browse Drives
          </Link>

          <Link
            to="/companies"
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive('/companies') ? 'var(--wine-red)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Building2 size={18} />
            Recruiters
          </Link>

          {/* Role-Specific Portal Links */}
          {isAuthenticated && (
            <>
              {isStudent && (
                <Link
                  to="/student/dashboard"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: location.pathname.startsWith('/student') ? 'var(--wine-red)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <GraduationCap size={18} />
                  Student Portal
                </Link>
              )}

              {isCompany && (
                <Link
                  to="/company/dashboard"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: location.pathname.startsWith('/company') ? 'var(--wine-red)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Building2 size={18} />
                  Recruiter Hub
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: location.pathname.startsWith('/admin') ? 'var(--wine-red)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <ShieldCheck size={18} />
                  Admin Cell
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notifications Button */}
          <button
            onClick={() => setNotifModalOpen(true)}
            title="Placement Announcements"
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-alt)',
              color: 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}
          >
            <Bell size={20} />
            {unreadNotifsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--orange)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--wine-red)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color:
                        user.role === 'admin'
                          ? 'var(--wine-red)'
                          : user.role === 'company'
                          ? 'var(--sky-blue-dark)'
                          : 'var(--orange)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
                style={{ padding: '0.45rem 0.75rem' }}
              >
                <LogOut size={16} />
                <span className="hide-mobile">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', padding: '0.5rem', color: 'var(--text-secondary)' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'white',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Briefcase size={18} /> Browse Drives
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '0.5rem 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Building2 size={18} /> Recruiters
          </Link>

          {isAuthenticated && (
            <>
              {isStudent && (
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--wine-red)' }}
                >
                  Student Dashboard
                </Link>
              )}
              {isCompany && (
                <Link
                  to="/company/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--sky-blue)' }}
                >
                  Company Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--wine-red)' }}
                >
                  Admin Cell Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      )}

      {/* Inline styles for responsive header */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-mobile { display: none; }
        }
      `}</style>

      {/* Announcements Modal */}
      {notifModalOpen && <NotificationModal onClose={() => setNotifModalOpen(false)} />}
    </header>
  );
};

export default Navbar;
