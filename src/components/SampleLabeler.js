import React, { useState } from 'react';
import { samples } from '../data/query_example.json';
import { getNextSample } from '../utils/sampleUtils';
import ProgressDisplay from './ProgressDisplay';

const SampleLabeler = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSample, setCurrentSample] = useState(samples[0]);
  
  const handleNext = () => {
    const nextSample = getNextSample(samples, currentIndex);
    setCurrentIndex((currentIndex + 1) % samples.length);
    setCurrentSample(nextSample);
  };
  
  return (
    <div className="sample-labeler">
      <ProgressDisplay currentIndex={currentIndex} />
      
      {/* Display current sample */}
      <div className="sample-container">
        <h3>User Query:</h3>
        <p>{currentSample.user_query}</p>
        
        <h3>Response Fragment:</h3>
        <p>{currentSample.response_fragment}</p>
        
        {/* Labeling controls would go here */}
      </div>
      
      <button onClick={handleNext}>Next Sample</button>
    </div>
  );
};

export default SampleLabeler;
