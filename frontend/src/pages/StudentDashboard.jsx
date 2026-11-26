import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Briefcase,
  FileText,
  User,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import JobDetailsModal from '../components/jobs/JobDetailsModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'drives', 'profile'
  const [loading, setLoading] = useState(true);

  // Data
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);

  // Selected job for modal
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    rollNumber: '',
    branch: 'Computer Science (CSE)',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    passingYear: '2026',
    activeBacklogs: '0',
    skills: '',
    phone: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    resumeUrl: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [profRes, appsRes, jobsRes] = await Promise.allSettled([
        api.get('/students/profile'),
        api.get('/applications/my-applications'),
        api.get('/jobs?status=Active'),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data.success) {
        const p = profRes.value.data.profile;
        setProfile(p);
        setProfileForm({
          rollNumber: p.rollNumber || '',
          branch: p.branch || 'Computer Science (CSE)',
          cgpa: p.cgpa !== undefined ? p.cgpa : '',
          tenthPercentage: p.tenthPercentage || '',
          twelfthPercentage: p.twelfthPercentage || '',
          passingYear: p.passingYear || 2026,
          activeBacklogs: p.activeBacklogs !== undefined ? p.activeBacklogs : 0,
          skills: p.skills ? p.skills.join(', ') : '',
          phone: p.phone || '',
          bio: p.bio || '',
          githubUrl: p.githubUrl || '',
          linkedinUrl: p.linkedinUrl || '',
          resumeUrl: p.resumeUrl || '',
        });
      }

      if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
        setApplications(appsRes.value.data.applications || []);
      }

      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success) {
        setActiveJobs(jobsRes.value.data.jobs || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading student dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await api.put('/students/profile', profileForm);
      if (res.data.success) {
        setProfile(res.data.profile);
        addToast('Academic profile updated successfully!', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating profile.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploadingResume(true);
      const res = await api.post('/students/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        addToast('Resume uploaded successfully!', 'success');
        setProfileForm((prev) => ({ ...prev, resumeUrl: res.data.resumeUrl }));
        fetchStudentData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error uploading resume.', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  // Metrics
  const totalApplied = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--wine-red), #991b1b)',
            color: 'white',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                STUDENT PORTAL
              </span>
              <span style={{ fontSize: '0.85rem', color: '#fed7aa' }}>
                Roll: {profile?.rollNumber || 'Not Set'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              Welcome, {user?.name}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.92rem', marginTop: '0.25rem' }}>
              {profile?.branch || 'Department'} • Current CGPA: <strong>{profile?.cgpa || 0}</strong> • Passing: {profile?.passingYear || 2026}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('drives')}
              className="btn btn-sky"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Briefcase size={18} /> Apply for Drives
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="btn btn-outline"
              style={{ background: 'white', color: 'var(--wine-red)', borderColor: 'white' }}
            >
              <User size={18} /> Edit Profile
            </button>
          </div>
        </div>

        {/* Top 4 Quick Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--sky-blue)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--sky-blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sky-blue-dark)' }}>
              <FileCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalApplied}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Drives Applied</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{shortlistedCount}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Shortlisted Rounds</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{selectedCount}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Offers Secured</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--orange)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeJobs.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Drives Open</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <FileText size={18} />
            My Application History & Tracker ({applications.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'drives' ? 'active' : ''}`}
            onClick={() => setActiveTab('drives')}
          >
            <Briefcase size={18} />
            Browse Campus Drives ({activeJobs.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <GraduationCap size={18} />
            Academic Details & Resume
          </button>
        </div>

        {/* Tab 1: Application Tracker */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            {loading ? (
              <LoadingSpinner message="Loading your applications..." />
            ) : applications.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  You haven't applied to any drives yet
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                  Explore active job drives and apply to positions matching your branch and CGPA.
                </p>
                <button className="btn btn-primary" onClick={() => setActiveTab('drives')}>
                  Browse Campus Drives Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      borderLeft: `5px solid ${
                        app.status === 'Selected'
                          ? '#10b981'
                          : app.status === 'Shortlisted'
                          ? '#8b5cf6'
                          : app.status === 'Rejected'
                          ? '#ef4444'
                          : app.status === 'Under Review'
                          ? '#f59e0b'
                          : 'var(--sky-blue)'
                      }`,
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--sky-blue-dark)' }}>
                          {app.job?.companyProfile?.companyName || 'Corporate Recruiter'}
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {app.job?.title}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                          <span>Package: <strong>₹{app.job?.packageLPA} LPA</strong></span>
                          <span>•</span>
                          <span>Location: {app.job?.location}</span>
                          <span>•</span>
                          <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>

                    {/* Visual Status Stepper */}
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          textAlign: 'center',
                          position: 'relative',
                          gap: '0.5rem',
                        }}
                      >
                        {['Applied', 'Under Review', 'Shortlisted', 'Selected'].map((step, idx) => {
                          const statusOrder = ['Applied', 'Under Review', 'Shortlisted', 'Selected'];
                          const currentIdx = statusOrder.indexOf(app.status);
                          const isDone = app.status !== 'Rejected' && currentIdx >= idx;
                          const isCurrent = app.status === step;

                          return (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background:
                                    app.status === 'Rejected' && idx === 0
                                      ? '#ef4444'
                                      : isDone
                                      ? 'var(--wine-red)'
                                      : '#e2e8f0',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  marginBottom: '0.35rem',
                                }}
                              >
                                {idx + 1}
                              </div>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: isCurrent ? 700 : 500,
                                  color: isCurrent ? 'var(--wine-red)' : 'var(--text-secondary)',
                                }}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recruiter Remarks if any */}
                      {app.remarks && (
                        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Recruiter Notes: </span>
                          <span style={{ color: 'var(--text-secondary)' }}>{app.remarks}</span>
                        </div>
                      )}

                      {app.interviewDate && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: '#15803d', fontWeight: 600 }}>
                          📅 Scheduled Interview Date: {new Date(app.interviewDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Browse Drives */}
        {activeTab === 'drives' && (
          <div className="animate-fade-in">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {activeJobs.map((job) => {
                const hasApplied = applications.some((a) => a.job?._id === job._id);

                return (
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sky-blue-dark)' }}>
                            {job.companyProfile?.companyName || job.company?.name}
                          </span>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem' }}>
                            {job.title}
                          </h3>
                        </div>
                        {hasApplied ? (
                          <span className="badge badge-applied">Applied</span>
                        ) : (
                          <StatusBadge status={job.status} />
                        )}
                      </div>

                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {job.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Package:</span>
                          <strong style={{ color: 'var(--wine-red)' }}>₹{job.packageLPA} LPA</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Min CGPA:</span>
                          <strong>{job.eligibility?.minCgpa || 6.0}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Deadline:</span>
                          <span>{new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => setSelectedJobId(job._id)}
                    >
                      {hasApplied ? 'View Application Status' : 'Check Eligibility & Apply'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Academic Details & Resume */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Academic Profile & Resume Management
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  Keep your CGPA, backlogs, and verified resume updated so placement algorithms can qualify you for drives.
                </p>
              </div>

              {/* Resume Upload Strip */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1.5px dashed var(--border-light)',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--wine-red-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wine-red)' }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Candidate Resume</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {profile?.resumeUrl ? (
                          <span style={{ color: '#15803d', fontWeight: 600 }}>
                            ✅ Resume Active: {profile.resumeOriginalName || 'Uploaded Resume'}
                          </span>
                        ) : (
                          <span style={{ color: '#b45309' }}>⚠️ No resume uploaded yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {profile?.resumeUrl && (
                      <a
                        href={profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `http://localhost:5000${profile.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <ExternalLink size={15} /> View Resume
                      </a>
                    )}
                    <label className="btn btn-sky btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      <Upload size={15} />
                      {uploadingResume ? 'Uploading...' : 'Upload PDF/Doc'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingResume}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Student Roll Number / Reg No *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.rollNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Branch / Department *</label>
                    <select
                      className="form-control"
                      value={profileForm.branch}
                      onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
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
                      value={profileForm.cgpa}
                      onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Active Backlogs *</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={profileForm.activeBacklogs}
                      onChange={(e) => setProfileForm({ ...profileForm, activeBacklogs: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">10th Standard Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="form-control"
                      value={profileForm.tenthPercentage}
                      onChange={(e) => setProfileForm({ ...profileForm, tenthPercentage: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">12th Standard Percentage (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="form-control"
                      value={profileForm.twelfthPercentage}
                      onChange={(e) => setProfileForm({ ...profileForm, twelfthPercentage: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Passing Out Year</label>
                    <select
                      className="form-control"
                      value={profileForm.passingYear}
                      onChange={(e) => setProfileForm({ ...profileForm, passingYear: e.target.value })}
                    >
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Technical Skills (Comma Separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. React.js, Node.js, Python, Java, System Design, SQL"
                    value={profileForm.skills}
                    onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://github.com/username"
                      value={profileForm.githubUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://linkedin.com/in/username"
                      value={profileForm.linkedinUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Professional Bio / Objective</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Briefly describe your interests, projects, and career aspirations..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {updatingProfile ? 'Saving Changes...' : 'Save Academic Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Job Details & Eligibility Checking */}
        {selectedJobId && (
          <JobDetailsModal
            jobId={selectedJobId}
            onClose={() => setSelectedJobId(null)}
            onAppliedSuccess={() => fetchStudentData()}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
