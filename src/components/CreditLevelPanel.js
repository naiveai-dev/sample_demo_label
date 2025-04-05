import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/components/CreditLevelPanel.css';

const CreditLevelPanel = () => {
  const { creditLevel, setShowingCreditLevel, validationResult } = useContext(AppContext);
  
  const returnToLabeling = () => {
    setShowingCreditLevel(false);
  };
  
  return (
    <div className="panel data-panel">
      <div className="panel-title">User Credit Level</div>
      
      <div className="credit-level-content">
        <div className="credit-title">User: DataLabeler_42</div>
        
        <div>Current Level: <b>{creditLevel.level}</b></div>
        
        <div className="level-indicator">
          <div 
            className="level-fill" 
            style={{ 
              width: `${creditLevel.trustScore}%`,
              backgroundColor: creditLevel.isGenuineUser ? undefined : '#f44336' 
            }}
          ></div>
          <div className="level-label">{creditLevel.trustScore}% to next level</div>
        </div>
        
        {validationResult && !creditLevel.isGenuineUser && (
          <div style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            padding: '10px', 
            border: '1px solid #f44336',
            marginTop: '10px'
          }}>
            <div style={{ fontWeight: 'bold', color: '#f44336' }}>AI Validation Warning</div>
            <div>{validationResult.reasoning}</div>
          </div>
        )}
        
        <div className="credit-stats">
          <div className="credit-item">
            <span>User Accuracy</span>
            <span>{creditLevel.accuracy}%</span>
          </div>
          <div className="credit-item">
            <span>Completed Tasks</span>
            <span>{creditLevel.completedTasks}</span>
          </div>
          <div className="credit-item">
            <span>AI Evaluation Quota</span>
            <span>{creditLevel.remainingQuota}</span>
          </div>
          <div className="credit-item">
            <span>Trust Score</span>
            <span>{creditLevel.trustScore}/100</span>
          </div>
        </div>
        
        <button className="credit-btn" onClick={returnToLabeling}>
          Return to Labeling
        </button>
      </div>
    </div>
  );
};

export default CreditLevelPanel;