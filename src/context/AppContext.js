import React, { createContext, useState, useEffect } from 'react';
import sampleData from '../data/query_example.json';
import { validateUserAuthenticity } from '../services/claudeService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [stats, setStats] = useState({
    total: 15,
    yes: 9,
    no: 6,
    accuracy: 84,
    speed: 4.2
  });
  
  const [creditLevel, setCreditLevel] = useState({
    accuracy: 84,
    level: "Intermediate",
    completedTasks: 278,
    remainingQuota: 122,
    trustScore: 75,
    isGenuineUser: true
  });
  
  const [showingCreditLevel, setShowingCreditLevel] = useState(false);
  const [labelingHistory, setLabelingHistory] = useState([]);
  const [userValidationInProgress, setUserValidationInProgress] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  
  // Initialize current sample with default values matching the original HTML
  const [currentSample, setCurrentSample] = useState({
    id: "TX482-95JK",
    number: 16,
    total: 100,
    data: {
      user_query: "What are the benefits of implementing AI in healthcare?",
      response_fragment: "AI systems can assist in early disease detection through pattern recognition in medical images and patient data, potentially identifying conditions before they become symptomatic. This allows for earlier interventions which typically result in better patient outcomes."
    }
  });
  
  // Load samples from JSON if available
  useEffect(() => {
    if (sampleData && sampleData.samples && sampleData.samples.length > 0) {
      const firstSample = sampleData.samples[0];
      setCurrentSample({
        id: firstSample.id,
        number: 16, // Keep the original number
        total: 100, // Keep the original total
        data: {
          user_query: firstSample.user_query,
          response_fragment: firstSample.response_fragment
        }
      });
    }
  }, []);
  
  // Check if we need to validate the user (after every 5 labelings)
  useEffect(() => {
    const checkUserAuthenticity = async () => {
      if (labelingHistory.length >= 5 && !userValidationInProgress) {
        setUserValidationInProgress(true);
        
        // Get the last 5 labeled items
        const lastFiveItems = labelingHistory.slice(-5);
        
        try {
          // Call Claude API to validate user
          const result = await validateUserAuthenticity(lastFiveItems);
          setValidationResult(result);
          
          // Update credit level based on validation
          setCreditLevel(prev => ({
            ...prev,
            isGenuineUser: result.isGenuineUser,
            trustScore: result.isGenuineUser ? 
              Math.min(prev.trustScore + 5, 100) : 
              Math.max(prev.trustScore - 10, 0)
          }));
          
          // Show validation result to user if not genuine
          if (!result.isGenuineUser) {
            alert(`User validation warning: ${result.reasoning}`);
            setShowingCreditLevel(true);
          }
        } catch (error) {
          console.error("Error during user validation:", error);
        } finally {
          // Clear history after validation
          setLabelingHistory([]);
          setUserValidationInProgress(false);
        }
      }
    };
    
    checkUserAuthenticity();
  }, [labelingHistory, userValidationInProgress]);
  
  const labelData = (label) => {
    // Don't allow labeling during validation
    if (userValidationInProgress) return;
    
    // Add current sample and label to history
    const historyItem = {
      id: currentSample.id,
      user_query: currentSample.data.user_query,
      response_fragment: currentSample.data.response_fragment,
      userLabel: label
    };
    
    setLabelingHistory(prev => [...prev, historyItem]);
    
    // Update statistics
    setStats(prevStats => ({
      ...prevStats,
      total: prevStats.total + 1,
      yes: label === 'yes' ? prevStats.yes + 1 : prevStats.yes,
      no: label === 'no' ? prevStats.no + 1 : prevStats.no
    }));
    
    // Update credit level
    setCreditLevel(prev => ({
      ...prev,
      completedTasks: prev.completedTasks + 1,
      remainingQuota: prev.remainingQuota - 1
    }));

    // Generate a new sample ID (matching the format in the original HTML)
    const newId = `TX482-${Math.floor(Math.random() * 900) + 100}`;
    
    // Get next sample from JSON if available, otherwise generate random
    let nextSample = {
      user_query: "What are the benefits of implementing AI in healthcare?",
      response_fragment: "AI systems can assist in early disease detection through pattern recognition in medical images and patient data, potentially identifying conditions before they become symptomatic. This allows for earlier interventions which typically result in better patient outcomes."
    };
    
    if (sampleData && sampleData.samples && sampleData.samples.length > 0) {
      const nextIndex = (currentSample.number % sampleData.samples.length);
      if (sampleData.samples[nextIndex]) {
        nextSample = {
          user_query: sampleData.samples[nextIndex].user_query,
          response_fragment: sampleData.samples[nextIndex].response_fragment
        };
      }
    }
    
    // Update current sample
    setCurrentSample(prev => ({
      ...prev,
      id: newId,
      number: prev.number + 1,
      data: nextSample
    }));
    
    // In a real app, you would send this data to a server
    alert(`Data labeled as: ${label}`);
  };

  return (
    <AppContext.Provider value={{
      stats,
      creditLevel,
      showingCreditLevel,
      setShowingCreditLevel,
      currentSample,
      labelData,
      validationResult,
      userValidationInProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};