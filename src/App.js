import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import LogoPanel from './components/LogoPanel';
import StatsPanel from './components/StatsPanel';
import DataLabelingPanel from './components/DataLabelingPanel';
import CreditLevelPanel from './components/CreditLevelPanel';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  const { showingCreditLevel } = useContext(AppContext);

  return (
    <>
      <div className="main-grid">
        <LogoPanel />
        <StatsPanel />
        {showingCreditLevel ? <CreditLevelPanel /> : <DataLabelingPanel />}
      </div>
      <Footer />
    </>
  );
}

export default App;