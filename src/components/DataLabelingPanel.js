import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/components/DataLabelingPanel.css';

const DataLabelingPanel = () => {
  const { currentSample, labelData, userValidationInProgress } = useContext(AppContext);
  
  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'o') {
        labelData('yes');
      } else if (e.key.toLowerCase() === 'x') {
        labelData('no');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [labelData]);
  
  return (
    <div className="panel data-panel">
      <div className="panel-title">
        Data Labeling
        {userValidationInProgress && <span className="validation-badge">Validating User...</span>}
      </div>
      
      <div>Sample ID: <b>{currentSample.id}</b> ({currentSample.number} of {currentSample.total})</div>
      
      <div className="data-content">
{`{
  "user_query": "${currentSample.data.user_query}",
  "response_fragment": "${currentSample.data.response_fragment}"
}`}
      </div>
      
      <div className="data-prompt">
        Is this response accurate and helpful?
      </div>
      
      <div className="button-container">
        <button 
          id="btn-yes" 
          className="btn btn-yes" 
          onClick={() => labelData('yes')}
          disabled={userValidationInProgress}
        >
          Yes (O)
        </button>
        <button 
          id="btn-no" 
          className="btn btn-no" 
          onClick={() => labelData('no')}
          disabled={userValidationInProgress}
        >
          No (X)
        </button>
      </div>
      
      <div className="keyboard-hint">
        Keyboard shortcuts: <span className="keyboard-key">O</span> for Yes, <span className="keyboard-key">X</span> for No
      </div>
    </div>
  );
};

export default DataLabelingPanel;