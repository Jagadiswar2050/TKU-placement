import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  BookOpen,
  Award,
  ArrowRight,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState('student'); // 'student' or 'company'
  const [loading, setLoading] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Student specific fields
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('Computer Science (CSE)');
  const [cgpa, setCgpa] = useState('');
  const [passingYear, setPassingYear] = useState('2026');
  const [skills, setSkills] = useState('');

  // Company specific fields
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [location, setLocation] = useState('Bengaluru / Hybrid');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      addToast('Please fill all mandatory fields.', 'warning');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: role === 'company' ? (companyName || name) : name,
        email,
        password,
        role,
        phone,
      };

      if (role === 'student') {
        payload.rollNumber = rollNumber || `STU-${Date.now().toString().slice(-4)}`;
        payload.branch = branch;
        payload.cgpa = cgpa ? parseFloat(cgpa) : 0;
        payload.passingYear = parseInt(passingYear);
        payload.skills = skills ? skills.split(',').map((s) => s.trim()) : [];
      } else {
        payload.companyName = companyName || name;
        payload.website = website;
        payload.industry = industry;
        payload.location = location;
      }

      await register(payload);
      addToast('Registration successful! Welcome to the Placement Portal.', 'success');

      if (role === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 1.25rem', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Register as a Student or Corporate Hiring Partner
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Role Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              padding: '0.35rem',
              background: 'var(--bg-alt)',
              borderRadius: '12px',
              marginBottom: '2rem',
            }}
          >
            <button
              type="button"
              onClick={() => setRole('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                background: role === 'student' ? 'white' : 'transparent',
                color: role === 'student' ? 'var(--wine-red)' : 'var(--text-secondary)',
                boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <GraduationCap size={20} />
              Student Registration
            </button>
            <button
              type="button"
              onClick={() => setRole('company')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                background: role === 'company' ? 'white' : 'transparent',
                color: role === 'company' ? 'var(--sky-blue-dark)' : 'var(--text-secondary)',
                boxShadow: role === 'company' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Building2 size={20} />
              Company / Recruiter
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{role === 'company' ? 'Recruiter Contact Name *' : 'Full Name *'}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={role === 'company' ? 'e.g. Karan Malhotra' : 'e.g. Aarav Sharma'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder={role === 'company' ? 'recruiter@company.com' : 'student@college.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password * (Min 6 characters)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Create strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Student Specific Fields */}
            {role === 'student' && (
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--wine-red)', marginBottom: '0.75rem' }}>
                  Academic Credentials
                </h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Roll Number / Student ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 23CS0101"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Branch / Department *</label>
                    <select
                      className="form-control"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                    >
                      <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                      <option value="Electrical (EEE)">Electrical (EEE)</option>
                      <option value="Mechanical (MECH)">Mechanical (MECH)</option>
                      <option value="Civil (CIVIL)">Civil (CIVIL)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Current CGPA (Out of 10) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      className="form-control"
                      placeholder="e.g. 8.5"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Graduation Passing Year</label>
                    <select
                      className="form-control"
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Key Technical Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. React.js, Node.js, Python, Java, SQL"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Company Specific Fields */}
            {role === 'company' && (
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--sky-blue-dark)', marginBottom: '0.75rem' }}>
                  Company Profile Details
                </h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Legal Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Infosys Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://company.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Industry Domain</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Cloud & AI / Software"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Headquarters / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Bengaluru / Hyderabad"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-light)',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
            }}
          >
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--wine-red)', fontWeight: 700 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
