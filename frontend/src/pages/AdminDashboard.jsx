import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  FileText,
  Award,
  TrendingUp,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Download,
  Filter,
  Trash2,
  PlusCircle,
  Send,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'students', 'companies', 'drives', 'applications', 'notices'
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [notices, setNotices] = useState([]);

  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBranchFilter, setStudentBranchFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  // Notice broadcast form state
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: '',
    type: 'info',
    targetRole: 'all',
  });
  const [broadcastingNotice, setBroadcastingNotice] = useState(false);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      addToast('Error fetching admin statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      let q = `/admin/students?search=${encodeURIComponent(studentSearch)}`;
      if (studentBranchFilter !== 'All') q += `&branch=${encodeURIComponent(studentBranchFilter)}`;
      const res = await api.get(q);
      if (res.data.success) setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      if (res.data.success) setCompanies(res.data.companies || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await api.get('/jobs?status=');
      if (res.data.success) setAllJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      let q = `/applications/all?`;
      if (appStatusFilter !== 'All') q += `status=${appStatusFilter}`;
      const res = await api.get(q);
      if (res.data.success) setAllApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await api.get('/admin/notifications');
      if (res.data.success) setNotices(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminStats();
    fetchDrives();
    fetchStudents();
    fetchCompanies();
    fetchApplications();
    fetchNotices();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'companies') fetchCompanies();
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'notices') fetchNotices();
  }, [activeTab, studentBranchFilter, appStatusFilter]);

  const handleToggleUser = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        addToast(res.data.message, 'success');
        fetchStudents();
        fetchCompanies();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error updating status.', 'error');
    }
  };

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    try {
      setBroadcastingNotice(true);
      const res = await api.post('/admin/notifications', noticeForm);
      if (res.data.success) {
        addToast('Placement notice broadcasted successfully!', 'success');
        setNoticeForm({ title: '', message: '', type: 'info', targetRole: 'all' });
        fetchNotices();
      }
    } catch (err) {
      addToast('Error posting notification.', 'error');
    } finally {
      setBroadcastingNotice(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      addToast('Notice deleted.', 'info');
      fetchNotices();
    } catch (err) {
      addToast('Error deleting notice.', 'error');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #541920, #722F37)',
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
                TRAINING & PLACEMENT CELL
              </span>
              <span style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
                Officer: {user?.name}
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
              Campus Placement Administration
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.92rem', marginTop: '0.25rem' }}>
              Oversee batch metrics, corporate drives, student eligibility, and campus-wide hiring statistics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('notices')}
              className="btn btn-orange"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Bell size={18} /> Broadcast Announcement
            </button>
            <button
              onClick={handlePrintReport}
              className="btn btn-outline"
              style={{ background: 'white', color: 'var(--wine-red)', borderColor: 'white' }}
            >
              <Printer size={18} /> Print Placement Report
            </button>
          </div>
        </div>

        {/* 6 Core Statistics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--wine-red)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wine-red)' }}>
              {stats?.totalStudents ?? 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Registered Students</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--sky-blue)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--sky-blue-dark)' }}>
              {stats?.totalCompanies ?? 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Verified Companies</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--orange)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--orange)' }}>
              {stats?.totalJobs ?? 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Job Drives</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7e22ce' }}>
              {stats?.totalApplications ?? 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Applications</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d' }}>
              {stats?.selectedCount ?? 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Offers Rolled Out</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>
              {stats?.placementRate ?? 0}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Placement Conversion</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} /> Analytics & Charts
          </button>
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={18} /> Manage Students ({students.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            <Building2 size={18} /> Manage Companies ({companies.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'drives' ? 'active' : ''}`}
            onClick={() => setActiveTab('drives')}
          >
            <Briefcase size={18} /> Campus Drives ({allJobs.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <FileText size={18} /> Master Applications Report
          </button>
          <button
            className={`tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            <Bell size={18} /> Announcements ({notices.length})
          </button>
        </div>

        {/* Tab 1: Overview & Visual Analytics */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              {/* Application Status Funnel Breakdown */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  Application Pipeline Distribution
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats?.statusDistribution?.map((item) => {
                    const total = stats.totalApplications || 1;
                    const pct = Math.round((item.count / total) * 100);

                    return (
                      <div key={item.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 600 }}>{item.name}</span>
                          <span><strong>{item.count}</strong> ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.max(pct, item.count > 0 ? 5 : 0)}%`,
                              height: '100%',
                              backgroundColor: item.color,
                              borderRadius: '5px',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Branch-wise Placements Performance */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  Branch-wise Placement Statistics
                </h3>

                <div className="custom-table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Branch</th>
                        <th>Total Students</th>
                        <th>Placed</th>
                        <th>Placement %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.branchStats?.map((b) => {
                        const pct = b.totalStudents > 0 ? Math.round((b.placedStudents / b.totalStudents) * 100) : 0;
                        return (
                          <tr key={b.branch}>
                            <td><strong>{b.branch}</strong></td>
                            <td>{b.totalStudents}</td>
                            <td><strong style={{ color: '#15803d' }}>{b.placedStudents}</strong></td>
                            <td>
                              <span
                                style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: pct >= 80 ? '#15803d' : pct >= 50 ? 'var(--sky-blue-dark)' : 'var(--orange)',
                                }}
                              >
                                {pct}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent 5 Applications */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Candidate Submissions</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('applications')}>
                  View All Submissions
                </button>
              </div>

              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Roll Number</th>
                      <th>Branch</th>
                      <th>Applied Drive</th>
                      <th>CTC</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentApplications?.map((app) => (
                      <tr key={app._id}>
                        <td><strong>{app.student?.name}</strong></td>
                        <td>{app.studentProfile?.rollNumber || 'STU-ID'}</td>
                        <td>{app.studentProfile?.branch?.replace(/\s*\(.*\)/, '')}</td>
                        <td>{app.job?.title}</td>
                        <td><strong>₹{app.job?.packageLPA} LPA</strong></td>
                        <td><StatusBadge status={app.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Students */}
        {activeTab === 'students' && (
          <div className="animate-fade-in">
            {/* Search and filters */}
            <div
              className="card"
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
                <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.2rem' }}
                    placeholder="Search by student name or email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
                  />
                </div>

                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={studentBranchFilter}
                  onChange={(e) => setStudentBranchFilter(e.target.value)}
                >
                  <option value="All">All Branches</option>
                  <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                  <option value="Information Technology (IT)">Information Technology (IT)</option>
                  <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                  <option value="Mechanical (MECH)">Mechanical (MECH)</option>
                </select>

                <button className="btn btn-primary btn-sm" onClick={fetchStudents}>
                  Filter
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Registered Students: <strong>{students.length}</strong>
              </div>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Branch</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>Applications</th>
                    <th>Status</th>
                    <th>Account Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu) => (
                    <tr key={stu._id}>
                      <td>
                        <strong>{stu.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                      </td>
                      <td>{stu.profile?.rollNumber || 'STU-ID'}</td>
                      <td>{stu.profile?.branch || 'N/A'}</td>
                      <td>
                        <strong style={{ color: 'var(--wine-red)' }}>{stu.profile?.cgpa || 0}</strong>
                      </td>
                      <td>{stu.profile?.activeBacklogs ?? 0}</td>
                      <td>{stu.applicationsCount || 0} applied</td>
                      <td>
                        {stu.isPlaced ? (
                          <span className="badge badge-selected">Placed</span>
                        ) : (
                          <span className="badge badge-under-review">Seeking</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleUser(stu._id)}
                          className="btn btn-outline btn-sm"
                          style={{
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.75rem',
                            color: stu.isApproved ? '#059669' : '#dc2626',
                          }}
                        >
                          {stu.isApproved ? 'Active (Click to Pause)' : 'Deactivated (Click to Activate)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Manage Companies */}
        {activeTab === 'companies' && (
          <div className="animate-fade-in">
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Recruiter Contact</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Drives Posted</th>
                    <th>Applications Received</th>
                    <th>Verification</th>
                    <th>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((comp) => (
                    <tr key={comp._id}>
                      <td>
                        <strong>{comp.profile?.companyName || comp.name}</strong>
                        {comp.profile?.website && (
                          <div style={{ fontSize: '0.75rem' }}>
                            <a href={comp.profile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--sky-blue)' }}>
                              {comp.profile.website}
                            </a>
                          </div>
                        )}
                      </td>
                      <td>
                        <div>{comp.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.email}</div>
                      </td>
                      <td>{comp.profile?.industry || 'Technology'}</td>
                      <td>{comp.profile?.location || 'Bengaluru'}</td>
                      <td><strong>{comp.jobsCount || 0}</strong> drives</td>
                      <td>{comp.applicationsCount || 0} candidates</td>
                      <td>
                        <span className="badge badge-selected">Verified</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleUser(comp._id)}
                          className="btn btn-outline btn-sm"
                          style={{
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.75rem',
                            color: comp.isApproved ? '#059669' : '#dc2626',
                          }}
                        >
                          {comp.isApproved ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Campus Drives Oversight */}
        {activeTab === 'drives' && (
          <div className="animate-fade-in">
            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Drive Title</th>
                    <th>Company</th>
                    <th>Package CTC</th>
                    <th>Type</th>
                    <th>Cutoff CGPA</th>
                    <th>Eligible Branches</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs.map((job) => (
                    <tr key={job._id}>
                      <td><strong>{job.title}</strong></td>
                      <td>{job.companyProfile?.companyName || job.company?.name}</td>
                      <td><strong style={{ color: 'var(--wine-red)' }}>₹{job.packageLPA} LPA</strong></td>
                      <td>{job.jobType}</td>
                      <td>{job.eligibility?.minCgpa || 6.0}</td>
                      <td style={{ maxWidth: '200px', fontSize: '0.78rem' }}>
                        {job.eligibility?.allowedBranches?.join(', ') || 'All'}
                      </td>
                      <td>{new Date(job.deadline).toLocaleDateString()}</td>
                      <td><StatusBadge status={job.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Master Applications Report */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            <div
              className="card"
              style={{
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Filter by Status:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button className="btn btn-outline btn-sm" onClick={handlePrintReport}>
                <Download size={15} /> Export / Print Report
              </button>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Roll No</th>
                    <th>Branch</th>
                    <th>CGPA</th>
                    <th>Applied Job Drive</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {allApplications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.student?.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{app.student?.email}</div>
                      </td>
                      <td>{app.studentProfile?.rollNumber || 'STU-ID'}</td>
                      <td>{app.studentProfile?.branch?.replace(/\s*\(.*\)/, '')}</td>
                      <td><strong>{app.studentProfile?.cgpa || 0}</strong></td>
                      <td>{app.job?.title}</td>
                      <td>₹{app.job?.packageLPA} LPA</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Announcements / Notices */}
        {activeTab === 'notices' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Create notice form */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--wine-red)', marginBottom: '0.5rem' }}>
                Broadcast Campus Announcement
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                Published notices will immediately appear on the Student Notice Board and Navbar bell icon.
              </p>

              <form onSubmit={handleNoticeSubmit}>
                <div className="form-group">
                  <label className="form-label">Notice Headline *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Google Coding Challenge Link Released"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Priority Type</label>
                    <select
                      className="form-control"
                      value={noticeForm.type}
                      onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value })}
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="urgent">Urgent / Exam Link (Orange)</option>
                      <option value="alert">Deadline Warning (Red)</option>
                      <option value="success">Placement Celebration (Green)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select
                      className="form-control"
                      value={noticeForm.targetRole}
                      onChange={(e) => setNoticeForm({ ...noticeForm, targetRole: e.target.value })}
                    >
                      <option value="all">Everyone (All)</option>
                      <option value="student">Students Only</option>
                      <option value="company">Recruiters Only</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notice Detailed Content *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Enter instructions, batch guidelines, test links or schedules..."
                    value={noticeForm.message}
                    onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={broadcastingNotice}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  <Send size={16} />
                  {broadcastingNotice ? 'Broadcasting...' : 'Publish Announcement'}
                </button>
              </form>
            </div>

            {/* Existing notices list */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
                Active Broadcasted Notices
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notices.map((n) => (
                  <div
                    key={n._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      borderLeft: `4px solid ${
                        n.type === 'urgent' ? 'var(--orange)' : n.type === 'alert' ? '#ef4444' : n.type === 'success' ? '#10b981' : 'var(--sky-blue)'
                      }`,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--wine-red)' }}>
                          {n.type}
                        </span>
                        <span>•</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{n.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {n.message}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteNotice(n._id)}
                      className="btn btn-sm"
                      style={{ color: '#ef4444', padding: '0.3rem' }}
                      title="Remove Notice"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
