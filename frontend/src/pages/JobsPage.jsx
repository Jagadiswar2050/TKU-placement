import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import JobDetailsModal from '../components/jobs/JobDetailsModal';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [branch, setBranch] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [minCgpa, setMinCgpa] = useState('');

  // Modal
  const [selectedJobId, setSelectedJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();
      queryParams.append('status', 'Active');
      if (keyword) queryParams.append('keyword', keyword);
      if (branch !== 'All') queryParams.append('branch', branch);
      if (jobType !== 'All') queryParams.append('jobType', jobType);
      if (minCgpa) queryParams.append('minCgpa', minCgpa);

      const res = await api.get(`/jobs?${queryParams.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [branch, jobType, minCgpa]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--wine-red)', textTransform: 'uppercase' }}>
            Campus Recruitment Drives
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            Explore Placement Opportunities
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Filter by branch eligibility, package, and role. Check your real-time eligibility with one click.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              {/* Keyword Search */}
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Search size={15} /> Search Drive / Role / Company / Skill
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Software Engineer, React, Google..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                    Search
                  </button>
                </div>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="form-label">Eligible Branch</label>
                <select className="form-control" value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="All">All Branches</option>
                  <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                  <option value="Information Technology (IT)">Information Technology (IT)</option>
                  <option value="Electronics & Comm (ECE)">Electronics & Comm (ECE)</option>
                  <option value="Electrical (EEE)">Electrical (EEE)</option>
                  <option value="Mechanical (MECH)">Mechanical (MECH)</option>
                  <option value="Civil (CIVIL)">Civil (CIVIL)</option>
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="form-label">Opportunity Type</label>
                <select className="form-control" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Internship + Full-Time">Internship + Full-Time</option>
                </select>
              </div>

              {/* CGPA Cutoff Filter */}
              <div>
                <label className="form-label">Max CGPA Required</label>
                <select className="form-control" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)}>
                  <option value="">Any Cutoff</option>
                  <option value="6.5">Up to 6.5</option>
                  <option value="7.5">Up to 7.5</option>
                  <option value="8.0">Up to 8.0</option>
                  <option value="8.5">Up to 8.5</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Drives Listing Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching campus placement drives..." />
        ) : jobs.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: '16px',
            }}
          >
            <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No placement drives found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Try broadening your search query or reset filter options.
            </p>
            <button
              className="btn btn-outline btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setKeyword('');
                setBranch('All');
                setJobType('All');
                setMinCgpa('');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {jobs.map((job) => (
              <div
                key={job._id}
                className="card card-hover"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--wine-red)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedJobId(job._id)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          background: 'var(--bg-alt)',
                          border: '1px solid var(--border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--wine-red)',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                        }}
                      >
                        {job.companyProfile?.companyName?.charAt(0) || job.company?.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sky-blue-dark)' }}>
                          {job.companyProfile?.companyName || job.company?.name}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {job.title}
                        </h3>
                      </div>
                    </div>
                    <StatusBadge status={job.status} />
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

                  {/* Skills badges */}
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {job.skillsRequired.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            background: 'var(--bg-alt)',
                            color: 'var(--text-secondary)',
                            fontWeight: 600,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                          +{job.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Specifications grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.65rem',
                      fontSize: '0.82rem',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Package CTC: </span>
                      <strong style={{ color: 'var(--wine-red)' }}>₹{job.packageLPA} LPA</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Min CGPA: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{job.eligibility?.minCgpa || 6.0}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Type: </span>
                      <span>{job.jobType}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Deadline: </span>
                      <span>{new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-sky btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJobId(job._id);
                  }}
                >
                  View Details & Apply
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Details & Eligibility Check Modal */}
        {selectedJobId && (
          <JobDetailsModal
            jobId={selectedJobId}
            onClose={() => setSelectedJobId(null)}
            onAppliedSuccess={() => fetchJobs()}
          />
        )}
      </div>
    </div>
  );
};

export default JobsPage;
