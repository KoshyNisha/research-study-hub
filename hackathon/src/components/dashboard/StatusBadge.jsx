import React from 'react';
import Badge from '../ui/Badge';

const StatusBadge = ({ status }) => {
  const variants = {
    Draft: 'default',
    Sent: 'blue',
    Viewed: 'amber',
    Responded: 'green'
  };

  return (
    <Badge variant={variants[status] || 'default'} size="md">
      {status}
    </Badge>
  );
};

export default StatusBadge;
