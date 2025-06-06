import React from 'react';
import { ClipLoader } from 'react-spinners'
import './LoadingOverlay.css'; // CSS riêng

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <ClipLoader size={50} color="#ffffff" />
    </div>
  );
};

export default LoadingOverlay;
