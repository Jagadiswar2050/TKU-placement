import React, { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Briefcase, ExternalLink, CheckCircle } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CompanyDirectory = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        if (res.data.success) {
          setCompanies(res.data.companies || []);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--sky-blue-dark)', textTransform: 'uppercase' }}>
            Corporate Network
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            Recruiting Corporate Partners
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Discover the top tech companies, Fortune 500 enterprises, and startups actively recruiting from our campus.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading recruiting partners..." />
        ) : companies.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Building2 size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3>No registered companies found</h3>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {companies.map((comp) => (
              <div
                key={comp._id}
                className="card card-hover"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        background: 'var(--bg-alt)',
                        border: '1.5px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--wine-red)',
                        fontWeight: 800,
                        fontSize: '1.3rem',
                      }}
                    >
                      {comp.companyName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {comp.companyName}
                        </h3>
                        {comp.isVerified && <CheckCircle size={16} color="#059669" />}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--sky-blue-dark)', fontWeight: 600 }}>
                        {comp.industry}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '1.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {comp.description || 'Global corporate partner visiting campus for hiring engineering candidates.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={15} /> {comp.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Briefcase size={15} /> {comp.activeJobsCount || 0} Active Drives
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  {comp.website && (
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                    >
                      <Globe size={14} /> Website <ExternalLink size={12} />
                    </a>
                  )}
                  <a
                    href={`/jobs?keyword=${encodeURIComponent(comp.companyName)}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    View Drives
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDirectory;
