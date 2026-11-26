import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Award, ShieldCheck, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '3.5rem 0 2rem 0',
        marginTop: '4rem',
        borderTop: '3px solid var(--wine-red)',
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Project & Team */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--wine-red), var(--orange))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <GraduationCap size={22} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                Campus Placement Portal
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem', color: '#cbd5e1' }}>
              A modern, full-stack placement management system streamlining corporate drives, student eligibility
              verification, resume screening, and recruiter shortlists.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: 'rgba(114, 47, 55, 0.35)',
                border: '1px solid rgba(114, 47, 55, 0.6)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <Award size={16} />
              College Project: Team 4 (S.No. 23 to 29)
            </div>
          </div>

          {/* Col 2: Team Members Badge */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Team 4 Members
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 23</span>
                <span style={{ color: 'var(--sky-blue)' }}>Lead / Backend</span>
              </div>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 24</span>
                <span style={{ color: 'var(--sky-blue)' }}>React Frontend</span>
              </div>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 25</span>
                <span style={{ color: 'var(--sky-blue)' }}>Database & Schema</span>
              </div>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 26</span>
                <span style={{ color: 'var(--sky-blue)' }}>UI / UX Design</span>
              </div>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 27</span>
                <span style={{ color: 'var(--sky-blue)' }}>Authentication & Roles</span>
              </div>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 28</span>
                <span style={{ color: 'var(--sky-blue)' }}>Testing & Analytics</span>
              </div>
              <div style={{ color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Student S.No. 29</span>
                <span style={{ color: 'var(--sky-blue)' }}>Documentation & Presentation</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <li>
                <Link to="/jobs" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                  Active Job Drives
                </Link>
              </li>
              <li>
                <Link to="/companies" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                  Registered Companies
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                  Student & Recruiter Login
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                  Placement Cell Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Placement Office Info */}
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Training & Placement Cell
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--orange)" />
                <span>Placement Office, Main Admin Block</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--sky-blue)" />
                <span>placement.cell@college.edu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>Affiliated & Approved Campus Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} College Placement Portal. Built with MERN Stack.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>by <strong style={{ color: '#f8fafc' }}>Team 4 (S.No. 23 - 29)</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
