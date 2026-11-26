import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import StatusBadge from '../common/StatusBadge';

const JobDetailsModal = ({ jobId, onClose, onAppliedSuccess }) => {
  const { isAuthenticated, isStudent, user } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        if (res.data.success) {
          setJob(res.data.job);
        }
      } catch (err) {
        addToast('Failed to load job details.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Check eligibility if student is logged in
  useEffect(() => {
    const checkEligibility = async () => {
      if (isAuthenticated && isStudent && jobId) {
        try {
          setCheckingEligibility(true);
          const res = await api.get(`/students/check-eligibility/${jobId}`);
          if (res.data.success) {
            setEligibilityData(res.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setCheckingEligibility(false);
        }
      }
    };

    checkEligibility();
  }, [isAuthenticated, isStudent, jobId]);

  const handleApply = async () => {
    try {
      setSubmitting(true);
      const res = await api.post(`/applications/apply/${jobId}`);
      if (res.data.success) {
        addToast('Application submitted successfully! Recruiter has been notified.', 'success');
        if (onAppliedSuccess) onAppliedSuccess();
        // Refresh eligibility status locally
        setEligibilityData((prev) => ({
          ...prev,
          hasApplied: true,
          applicationStatus: 'Applied',
        }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error submitting application.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" style={{ padding: '3rem', textAlign: 'center' }}>
          Loading drive details...
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '750px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--wine-red), var(--wine-red-dark))',
            color: 'white',
            padding: '2rem',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fed7aa', textTransform: 'uppercase' }}>
              {job.companyProfile?.companyName || job.company?.name || 'Recruiter'}
            </span>
            <span>•</span>
            <span style={{ fontSize: '0.85rem', color: '#e0f2fe' }}>{job.jobType}</span>
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {job.title}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.88rem', opacity: 0.95 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={16} /> {job.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} /> Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Briefcase size={16} /> {job.openingsCount} Openings
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem' }}>
          {/* Key Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--wine-red-subtle)', border: '1px solid rgba(114, 47, 55, 0.15)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Annual Package (CTC)
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--wine-red)', marginTop: '0.2rem' }}>
                ₹{job.packageLPA} LPA
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--sky-blue-subtle)', border: '1px solid rgba(14, 165, 233, 0.15)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Internship Stipend
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--sky-blue-dark)', marginTop: '0.2rem' }}>
                {job.stipend || 'Performance Based'}
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--orange-subtle)', border: '1px solid rgba(234, 88, 12, 0.15)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Min CGPA Cutoff
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--orange)', marginTop: '0.2rem' }}>
                {job.eligibility?.minCgpa || 6.0} CGPA
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Job Role & Description
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Key Responsibilities
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {job.responsibilities.map((resp, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--sky-blue)', fontWeight: 800 }}>•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Desired Skills
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skillsRequired.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      background: 'var(--bg-alt)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility Criteria Breakdown */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid var(--border-light)',
              marginBottom: '2rem',
            }}
          >
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GraduationCap size={18} color="var(--wine-red)" />
              Eligibility Criteria Defined by Recruiter
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Eligible Branches: </span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {job.eligibility?.allowedBranches?.length ? job.eligibility.allowedBranches.join(', ') : 'All Branches'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Max Active Backlogs: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{job.eligibility?.maxBacklogs ?? 0} allowed</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Minimum CGPA: </span>
                <strong style={{ color: 'var(--wine-red)' }}>{job.eligibility?.minCgpa || 6.0}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Target Batch: </span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {job.eligibility?.eligiblePassingYears?.join(', ') || '2026'}
                </strong>
              </div>
            </div>
          </div>

          {/* Live Eligibility Evaluation Box for Logged-In Student */}
          {isAuthenticated && isStudent && (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1.5px solid',
                borderColor: eligibilityData?.hasApplied
                  ? '#0ea5e9'
                  : eligibilityData?.isEligible
                  ? '#10b981'
                  : '#f59e0b',
                background: eligibilityData?.hasApplied
                  ? '#f0f9ff'
                  : eligibilityData?.isEligible
                  ? '#f0fdf4'
                  : '#fffbeb',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                {eligibilityData?.hasApplied ? (
                  <>
                    <FileCheck size={20} color="#0ea5e9" />
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0369a1' }}>
                      Application Already Submitted
                    </h5>
                    <StatusBadge status={eligibilityData.applicationStatus} />
                  </>
                ) : eligibilityData?.isEligible ? (
                  <>
                    <CheckCircle2 size={20} color="#10b981" />
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#15803d' }}>
                      Eligibility Verified: You Qualify for this Drive!
                    </h5>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={20} color="#b45309" />
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#b45309' }}>
                      Eligibility Checklist Status
                    </h5>
                  </>
                )}
              </div>

              {eligibilityData?.reasons && (
                <ul style={{ listStyle: 'none', paddingLeft: '1.75rem', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {eligibilityData.reasons.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Action Button Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>

            {isAuthenticated && isStudent ? (
              eligibilityData?.hasApplied ? (
                <button className="btn btn-outline" disabled>
                  <CheckCircle2 size={18} /> Already Applied
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={submitting || checkingEligibility || !eligibilityData?.isEligible}
                  onClick={handleApply}
                >
                  <Send size={18} />
                  {submitting ? 'Submitting Application...' : 'Apply for this Job'}
                </button>
              )
            ) : !isAuthenticated ? (
              <a href="/login" className="btn btn-sky">
                Login as Student to Apply
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
