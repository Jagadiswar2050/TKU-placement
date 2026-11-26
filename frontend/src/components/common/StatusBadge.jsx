import React from 'react';
import { Clock, CheckCircle2, UserCheck, XCircle, Award } from 'lucide-react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Applied':
      return (
        <span className="badge badge-applied">
          <Clock size={12} /> Applied
        </span>
      );
    case 'Under Review':
      return (
        <span className="badge badge-under-review">
          <Clock size={12} /> Under Review
        </span>
      );
    case 'Shortlisted':
      return (
        <span className="badge badge-shortlisted">
          <UserCheck size={12} /> Shortlisted
        </span>
      );
    case 'Selected':
      return (
        <span className="badge badge-selected">
          <Award size={12} /> Selected / Offer
        </span>
      );
    case 'Rejected':
      return (
        <span className="badge badge-rejected">
          <XCircle size={12} /> Not Shortlisted
        </span>
      );
    case 'Active':
      return (
        <span className="badge badge-active">
          <CheckCircle2 size={12} /> Active Drive
        </span>
      );
    case 'Closed':
      return (
        <span className="badge badge-closed">
          <Clock size={12} /> Drive Closed
        </span>
      );
    default:
      return <span className="badge badge-applied">{status}</span>;
  }
};

export default StatusBadge;
