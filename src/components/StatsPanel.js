import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import '../styles/components/StatsPanel.css';

const StatsPanel = () => {
  const { stats, setShowingCreditLevel } = useContext(AppContext);
  
  const showCreditLevel = () => {
    setShowingCreditLevel(true);
  };
  
  return (
    <div className="panel stats-panel">
      <div className="panel-title">Labeling Stats</div>
      
      <div>Current Progress: <b>{stats.total} / 100</b> samples</div>
      
      <button id="credit-level-btn" className="credit-btn" onClick={showCreditLevel}>
        User Credit Level
      </button>
    </div>
  );
};

export default StatsPanel;