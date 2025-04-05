import React from 'react';
import { samples } from '../data/query_example.json';

const ProgressDisplay = ({ currentIndex }) => {
  const totalSamples = samples.length;
  
  return (
    <div className="progress-container">
      <p>Current Progress: {currentIndex + 1}/{totalSamples}</p>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex + 1) / totalSamples) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
