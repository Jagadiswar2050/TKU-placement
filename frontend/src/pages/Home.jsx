import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Users,
  Search,
  Sparkles,
  Calendar,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({
    highestLPA: 24.5,
    avgLPA: 11.2,
    placementRate: 94.6,
    totalDrives: 42,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, adminStatsRes] = await Promise.allSettled([
          api.get('/jobs?status=Active'),
          api.get('/admin/stats'),
        ]);

        if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success) {
          setFeaturedJobs(jobsRes.value.data.jobs.slice(0, 4));
        }

        if (adminStatsRes.status === 'fulfilled' && adminStatsRes.value.data.success) {
          const s = adminStatsRes.value.data.stats;
          setStats((prev) => ({
            ...prev,
            highestLPA: s.highestLPA || prev.highestLPA,
            avgLPA: s.avgLPA || prev.avgLPA,
            placementRate: s.placementRate || prev.placementRate,
            totalDrives: s.totalJobs || prev.totalDrives,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #4c1117 0%, #722F37 50%, #ea580c 100%)',
          color: 'white',
          padding: '4.5rem 0 5.5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.15)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '10%',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'rgba(234, 88, 12, 0.2)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Team 4 Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fed7aa',
                marginBottom: '1.5rem',
              }}
            >
              <Award size={16} />
              <span>Team 4 • College Placement Portal • S.No. 23 to 29</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              Accelerate Your Career with Next-Gen Campus Placements
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#f8fafc',
                opacity: 0.95,
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              A unified digital ecosystem for students to explore marquee job drives, recruiters to shortlist
              top engineering talent, and the placement cell to orchestrate campus recruitment.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '3rem',
              }}
            >
              <Link to="/jobs" className="btn btn-sky" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                <Search size={20} />
                Explore Active Drives
              </Link>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{
                  padding: '0.85rem 1.75rem',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                Sign In to Portal
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Quick Demo One-Click Access Bar */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(8px)',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9' }}>
                ⚡ Presentation Demo Accounts:
              </span>
              <Link
                to="/login?demo=student"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                Student (Aarav)
              </Link>
              <Link
                to="/login?demo=placed"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.3)',
                  color: '#6ee7b7',
                  fontWeight: 600,
                }}
              >
                Placed Student (Priya)
              </Link>
              <Link
                to="/login?demo=company"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(56, 189, 248, 0.3)',
                  color: '#bae6fd',
                  fontWeight: 600,
                }}
              >
                Recruiter (Google)
              </Link>
              <Link
                to="/login?demo=admin"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  background: 'rgba(234, 88, 12, 0.3)',
                  color: '#fdba74',
                  fontWeight: 600,
                }}
              >
                Placement Admin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div
            className="card"
            style={{
              padding: '1.75rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'var(--wine-red-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--wine-red)',
                }}
              >
                <TrendingUp size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--wine-red)' }}>
                  ₹{stats.highestLPA} LPA
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Highest Package Offered
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'var(--sky-blue-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sky-blue-dark)',
                }}
              >
                <Award size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--sky-blue-dark)' }}>
                  ₹{stats.avgLPA} LPA
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Average CTC Package
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'var(--orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--orange)',
                }}
              >
                <Users size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--orange)' }}>
                  {stats.placementRate}%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Batch Placement Rate
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                }}
              >
                <Building2 size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>
                  120+
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Recruiting Corporate Partners
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Placement Drives Section */}
      <section style={{ padding: '5rem 0 3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--orange)',
                }}
              >
                Top Campus Drives
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                Active Opportunities for 2026 Batch
              </h2>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm">
              View All Drives <ChevronRight size={16} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="card card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--wine-red)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sky-blue-dark)' }}>
                        {job.companyProfile?.companyName || job.company?.name || 'Top Recruiter'}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                        {job.title}
                      </h3>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '1.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>CTC Package:</span>
                      <strong style={{ color: 'var(--wine-red)', fontSize: '0.98rem' }}>₹{job.packageLPA} LPA</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Min CGPA:</span>
                      <strong>{job.eligibility?.minCgpa || 6.0} CGPA</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/jobs`}
                  className="btn btn-sky btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Check Eligibility & Apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Portals Showcase */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--wine-red)', textTransform: 'uppercase' }}>
              Role-Based Access
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem' }}>
              Built for Every Campus Placement Stakeholder
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Experience customized features and dashboards tailored specifically for students, recruiting companies,
              and placement officers.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Student Card */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--orange)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--orange-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--orange)',
                  marginBottom: '1.25rem',
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>For Students</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Create your verified profile with CGPA, marks, skills, and resume. Instant automated eligibility checks
                before applying to marquee drives.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--orange)" /> Automated CGPA & Branch eligibility filter
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--orange)" /> Live application timeline tracker
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--orange)" /> Official notice alerts & interview links
                </li>
              </ul>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Enter Student Portal
              </Link>
            </div>

            {/* Company Card */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--sky-blue)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--sky-blue-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--sky-blue-dark)',
                  marginBottom: '1.25rem',
                }}
              >
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>For Recruiters</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Post placement drives, specify exact eligibility requirements, review qualified candidate resumes, and
                shortlist candidates with interview schedules.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--sky-blue)" /> Define custom cutoffs (CGPA, backlogs)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--sky-blue)" /> Instant resume downloads & candidate ratings
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--sky-blue)" /> One-click shortlist & selection status updates
                </li>
              </ul>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Recruiter Portal
              </Link>
            </div>

            {/* Admin Card */}
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--wine-red)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--wine-red-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--wine-red)',
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Placement Cell</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Full administrative command center. Monitor application statuses, view branch-wise placement analytics,
                and broadcast urgent campus notifications.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--wine-red)" /> Visual statistics & placement analytics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--wine-red)" /> Manage students, companies & job drives
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--wine-red)" /> Generate comprehensive placement reports
                </li>
              </ul>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Placement Officer Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team 4 Presentation Showcase Callout */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, var(--wine-red-subtle), var(--sky-blue-subtle))',
              border: '2px solid var(--border-light)',
              borderRadius: '24px',
              padding: '2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--wine-red)',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                College Project Assignment
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--wine-red)' }}>
                Developed by Team 4 (Students S.No. 23 to 29)
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '0.5rem' }}>
                Complete full-stack MERN placement portal with role-based JWT authentication, automated eligibility
                evaluator, resume management, real-time application trackers, and live analytics.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/jobs" className="btn btn-primary">
                View Live Job Drives
              </Link>
              <Link to="/login" className="btn btn-outline">
                Test Demo Accounts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
