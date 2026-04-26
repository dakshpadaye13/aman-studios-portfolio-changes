import React from 'react';

const GhostButton = ({ children }) => {
  return (
    <button className="btn-ghost">
      {children}
    </button>
  );
};

export default GhostButton;
