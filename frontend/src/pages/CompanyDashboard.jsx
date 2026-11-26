import React, { useState, useEffect } from 'react';
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  FileText,
  UserCheck,
  CheckCircle,
  XCircle,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  Award,
  Clock,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'candidates', 'profile'
  const [loading, setLoading] = useState(true);

  // Data
  const [companyProfile, setCompanyProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // New Job Modal state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    role: 'Software Development',
    description: '',
    responsibilities: '',
    skillsRequired: '',
    packageLPA: '8.0',
    stipend: '₹30,000 / month',
    jobType: 'Full-Time',
    location: 'Bengaluru / Hybrid',
    openingsCount: '5',
    minCgpa: '7.0',
    maxBacklogs: '0',
    allowedBranches: ['Computer Science (CSE)', 'Information Technology (IT)'],
    deadline: '',
    status: 'Active',
  });
  const [savingJob, setSavingJob] = useState(false);

  // Status update modal / form
  const [statusUpdateState, setStatusUpdateState] = useState({});

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, jobsRes] = await Promise.allSettled([
        api.get('/companies/profile'),
        api.get('/jobs/my-jobs'),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.data.success) {
        setCompanyProfile(profRes.value.data.profile);
      }

      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success) {
        const jList = jobsRes.value.data.jobs || [];
        setJobs(jList);
        if (jList.length > 0 && !selectedJobForApplicants) {
          setSelectedJobForApplicants(jList[0]._id);
          fetchApplicants(jList[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error loading company portal data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoadingApplicants(true);
      const res = await api.get(`/applications/job/${jobId}`);
      if (res.data.success) {
        setApplicants(res.data.applications || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching applicants for this drive.', 'error');
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleJobSelect = (jobId) => {
    setSelectedJobForApplicants(jobId);
    fetchApplicants(jobId);
  };

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      role: 'Software Development',
      description: '',
      responsibilities: '',
      skillsRequired: '',
      packageLPA: '8.0',
      stipend: '₹30,000 / month',
      jobType: 'Full-Time',
      location: 'Bengaluru / Hybrid',
      openingsCount: '5',
      minCgpa: '7.0',
      maxBacklogs: '0',
      allowedBranches: ['Computer Science (CSE)', 'Information Technology (IT)'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
    });
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      setSavingJob(true);

      const payload = {
        title: jobForm.title,
        role: jobForm.role,
        description: jobForm.description,
        responsibilities: jobForm.responsibilities.split('\n').filter(Boolean),
        skillsRequired: jobForm.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
        packageLPA: parseFloat(jobForm.packageLPA),
        stipend: jobForm.stipend,
        jobType: jobForm.jobType,
        location: jobForm.location,
        openingsCount: parseInt(jobForm.openingsCount),
        eligibility: {
          minCgpa: parseFloat(jobForm.minCgpa),
          maxBacklogs: parseInt(jobForm.maxBacklogs),
          allowedBranches: jobForm.allowedBranches,
        },
        deadline: jobForm.deadline,
        status: jobForm.status,
      };

      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, payload);
        addToast('Job drive updated successfully!', 'success');
      } else {
        await api.post('/jobs', payload);
        addToast('New campus drive created and published!', 'success');
      }

      setJobModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving job drive.', 'error');
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this placement drive? Associated student applications will also be archived.')) {
      return;
    }
    try {
      await api.delete(`/jobs/${jobId}`);
      addToast('Job drive removed successfully.', 'info');
      fetchDashboardData();
    } catch (err) {
      addToast('Error deleting job drive.', 'error');
    }
  };

  const handleUpdateStatus = async (appId, newStatus, remarks) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        remarks: remarks || `Candidate moved to ${newStatus}`,
      });
      if (res.data.success) {
        addToast(`Candidate marked as '${newStatus}'!`, 'success');
        if (selectedJobForApplicants) {
          fetchApplicants(selectedJobForApplicants);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating candidate status.', 'error');
    }
  };

  // Branch checkbox toggle helper
  const handleBranchToggle = (branchName) => {
    setJobForm((prev) => {
      const current = prev.allowedBranches || [];
      if (current.includes(branchName)) {
        return { ...prev, allowedBranches: current.filter((b) => b !== branchName) };
      } else {
        return { ...prev, allowedBranches: [...current, branchName] };
      }
    });
  };

  // Aggregated Counts
  const totalApplicantsReceived = jobs.reduce((acc, curr) => acc + (curr.totalApplicants || 0), 0);
  const totalShortlisted = jobs.reduce((acc, curr) => acc + (curr.shortlistedCount || 0), 0);
  const totalSelected = jobs.reduce((acc, curr) => acc + (curr.selectedCount || 0), 0);

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0369a1, #0284c7)',
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
                RECRUITER HUB
              </span>
              <span style={{ fontSize: '0.85rem', color: '#bae6fd' }}>
                {companyProfile?.companyName || user?.name}
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              Corporate Recruitment Dashboard
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.92rem', marginTop: '0.25rem' }}>
              Post placement drives, filter candidate criteria, download resumes, and manage interview shortlists.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="btn btn-orange"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
          >
            <PlusCircle size={20} /> Post New Campus Drive
          </button>
        </div>

        {/* Metrics Row */}
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
              <Briefcase size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{jobs.length}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Job Drives</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--orange)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--orange-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalApplicantsReceived}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Applicants Received</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalShortlisted}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Candidates Shortlisted</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{totalSelected}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Final Offers Extended</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={18} /> Posted Drives ({jobs.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => setActiveTab('candidates')}
          >
            <Users size={18} /> Candidate Management & Shortlists ({applicants.length})
          </button>
        </div>

        {/* Tab 1: Posted Drives */}
        {activeTab === 'jobs' && (
          <div className="animate-fade-in">
            {loading ? (
              <LoadingSpinner message="Loading your drives..." />
            ) : jobs.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Placement Drives Posted Yet</h3>
                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
                  Create your first campus recruitment drive to accept applications from qualified batch students.
                </p>
                <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                  Create Campus Drive
                </button>
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Job Drive Title</th>
                      <th>Type / Role</th>
                      <th>Package CTC</th>
                      <th>Min CGPA</th>
                      <th>Deadline</th>
                      <th>Applicants</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td>
                          <strong>{job.title}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.location}</div>
                        </td>
                        <td>{job.role}</td>
                        <td>
                          <strong style={{ color: 'var(--wine-red)' }}>₹{job.packageLPA} LPA</strong>
                        </td>
                        <td>{job.eligibility?.minCgpa || 6.0}</td>
                        <td>{new Date(job.deadline).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              handleJobSelect(job._id);
                              setActiveTab('candidates');
                            }}
                          >
                            <Users size={14} /> {job.totalApplicants || 0} Candidates
                          </button>
                        </td>
                        <td>
                          <StatusBadge status={job.status} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="btn btn-sm"
                              style={{ color: '#ef4444', padding: '0.3rem 0.5rem' }}
                              title="Delete Drive"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Candidate Management & Shortlists */}
        {activeTab === 'candidates' && (
          <div className="animate-fade-in">
            {/* Job selector header */}
            <div
              className="card"
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Review Candidates for:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto', minWidth: '280px' }}
                  value={selectedJobForApplicants || ''}
                  onChange={(e) => handleJobSelect(e.target.value)}
                >
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} (₹{j.packageLPA} LPA)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Total Received: <strong>{applicants.length}</strong> candidates
              </div>
            </div>

            {loadingApplicants ? (
              <LoadingSpinner message="Fetching candidate profiles..." />
            ) : applicants.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>No Applications Received Yet for this Drive</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Eligible students will appear here as soon as they submit their applications.
                </p>
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Roll Number</th>
                      <th>Branch & CGPA</th>
                      <th>Skills</th>
                      <th>Resume</th>
                      <th>Current Status</th>
                      <th>Quick Shortlist Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app) => {
                      const p = app.studentProfile;
                      const resumePath = app.resumeSnapshot?.url || p?.resumeUrl;

                      return (
                        <tr key={app._id}>
                          <td>
                            <strong>{app.student?.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {app.student?.email}
                            </div>
                          </td>
                          <td>{p?.rollNumber || 'STU-ID'}</td>
                          <td>
                            <strong>{p?.cgpa || 0} CGPA</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {p?.branch} • {p?.activeBacklogs || 0} backlogs
                            </div>
                          </td>
                          <td style={{ maxWidth: '180px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                              {p?.skills?.slice(0, 3).map((s, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '0.7rem',
                                    background: '#f1f5f9',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            {resumePath ? (
                              <a
                                href={resumePath.startsWith('http') ? resumePath : `http://localhost:5000${resumePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                              >
                                <Download size={13} /> Resume
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Resume</span>
                            )}
                          </td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <select
                                className="form-control"
                                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Selected">Selected</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal: Create / Edit Job Drive */}
        {jobModalOpen && (
          <div className="modal-overlay" onClick={() => setJobModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
              <div
                style={{
                  padding: '1.25rem 1.75rem',
                  borderBottom: '1px solid var(--border-light)',
                  background: 'var(--sky-blue-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--sky-blue-dark)' }}>
                  Post New Campus Recruitment Drive
                </h3>
                <button onClick={() => setJobModalOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleSaveJob} style={{ padding: '1.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Job Drive Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Associate Software Engineer - Campus 2026"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={jobForm.role}
                      onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Annual CTC Package (in Lakhs INR) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      placeholder="e.g. 12.5"
                      value={jobForm.packageLPA}
                      onChange={(e) => setJobForm({ ...jobForm, packageLPA: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Monthly Stipend</label>
                    <input
                      type="text"
                      className="form-control"
                      value={jobForm.stipend}
                      onChange={(e) => setJobForm({ ...jobForm, stipend: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Nature</label>
                    <select
                      className="form-control"
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Internship + Full-Time">Internship + Full-Time</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of Vacancies</label>
                    <input
                      type="number"
                      className="form-control"
                      value={jobForm.openingsCount}
                      onChange={(e) => setJobForm({ ...jobForm, openingsCount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Eligibility Cutoffs */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--wine-red)', marginBottom: '0.75rem' }}>
                    Candidate Eligibility Rules
                  </h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Minimum CGPA Cutoff</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        className="form-control"
                        value={jobForm.minCgpa}
                        onChange={(e) => setJobForm({ ...jobForm, minCgpa: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Max Allowed Backlogs</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={jobForm.maxBacklogs}
                        onChange={(e) => setJobForm({ ...jobForm, maxBacklogs: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Allowed Engineering Branches</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.82rem' }}>
                      {[
                        'Computer Science (CSE)',
                        'Information Technology (IT)',
                        'Electronics & Comm (ECE)',
                        'Electrical (EEE)',
                        'Mechanical (MECH)',
                        'Civil (CIVIL)',
                      ].map((b) => (
                        <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={jobForm.allowedBranches?.includes(b)}
                            onChange={() => handleBranchToggle(b)}
                          />
                          <span>{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Application Deadline *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Drive Status</label>
                    <select
                      className="form-control"
                      value={jobForm.status}
                      onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description *</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Responsibilities (One per line)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Design and develop full stack applications..."
                    value={jobForm.responsibilities}
                    onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="React, Node.js, DSA, Cloud, SQL"
                    value={jobForm.skillsRequired}
                    onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setJobModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={savingJob}>
                    {savingJob ? 'Publishing...' : 'Publish Campus Drive'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
