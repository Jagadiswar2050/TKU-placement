import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  // Check if URL has ?demo= query parameter
  useEffect(() => {
    const demoType = searchParams.get('demo');
    if (demoType === 'student') {
      setEmail('aarav@student.edu');
      setPassword('Student@123');
      setRole('student');
    } else if (demoType === 'placed') {
      setEmail('priya@student.edu');
      setPassword('Student@123');
      setRole('student');
    } else if (demoType === 'company') {
      setEmail('google@careers.com');
      setPassword('Company@123');
      setRole('company');
    } else if (demoType === 'admin') {
      setEmail('admin@placement.edu');
      setPassword('Admin@123');
      setRole('admin');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      addToast(`Welcome back, ${res.user.name}!`, 'success');

      // Redirect by role
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (eMail, pWord, r) => {
    setEmail(eMail);
    setPassword(pWord);
    setRole(r);
  };

  return (
    <div style={{ padding: '3rem 1.25rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--wine-red), var(--orange))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your placement dashboard
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Quick Demo Credentials Bar */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px dashed var(--border-light)',
              borderRadius: '12px',
              padding: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--wine-red)', marginBottom: '0.5rem' }}>
              <Sparkles size={15} />
              <span>One-Click Demo Fill for Viva/Demo:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setDemoCredentials('aarav@student.edu', 'Student@123', 'student')}
                className="btn btn-sm"
                style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Aarav (Student)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('priya@student.edu', 'Student@123', 'student')}
                className="btn btn-sm"
                style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Priya (Placed)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('google@careers.com', 'Company@123', 'company')}
                className="btn btn-sm"
                style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Google (Recruiter)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@placement.edu', 'Admin@123', 'admin')}
                className="btn btn-sm"
                style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                Placement Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. aarav@student.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer inside card */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-light)',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
            }}
          >
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--wine-red)', fontWeight: 700 }}>
              Register Here
            </Link>
          </div>
        </div>

        {/* Project Team Stamp */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Placement Portal • Team 4 Assignment Project
        </div>
      </div>
    </div>
  );
};

export default Login;
