import React, { createContext, useState, useEffect } from 'react';
import sampleData from '../data/query_example.json';
import { validateUserAuthenticity } from '../services/claudeService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [stats, setStats] = useState({
    total: 1,
    yes: 0,
    no: 0,
    accuracy: 0,
    speed: 4.2
  });
  
  const [creditLevel, setCreditLevel] = useState({
    accuracy: 0,
    level: "Intermediate",
    completedTasks: 0,
    remainingQuota: 0,
    trustScore: 0,
    isGenuineUser: true
  });
  
  const [showingCreditLevel, setShowingCreditLevel] = useState(false);
  const [labelingHistory, setLabelingHistory] = useState([]);
  const [userValidationInProgress, setUserValidationInProgress] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  
  // Initialize current sample with default values matching the original HTML
  const [currentSample, setCurrentSample] = useState({
    id: "TX482-95JK",
    number: 1,
    total: 10,
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
        number: 1, // Keep the original number
        total: 10, // Keep the original total
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
  // Find the current sample in the original data to get its ground truth
  const currentSampleData = sampleData.samples.find(sample => sample.id === currentSample.id);
  const isCorrect = (label === 'yes' && currentSampleData.ground_truth === true) || 
                    (label === 'no' && currentSampleData.ground_truth === false);
  
  // Update labeling history
  const newHistoryItem = {
    id: currentSample.id,
    user_query: currentSample.data.user_query,
    response_fragment: currentSample.data.response_fragment,
    userLabel: label,
    isCorrect: isCorrect
  };
  
  const updatedHistory = [...labelingHistory, newHistoryItem];
  setLabelingHistory(updatedHistory);
  
  // Update stats
  const newTotal = stats.total + 1;
  const newYes = label === 'yes' ? stats.yes + 1 : stats.yes;
  const newNo = label === 'no' ? stats.no + 1 : stats.no;
  
  // Calculate accuracy based on correct answers
  const correctAnswers = updatedHistory.filter(item => item.isCorrect).length;
  const newAccuracy = (correctAnswers / updatedHistory.length) * 100;
  
  setStats({
    ...stats,
    total: newTotal,
    yes: newYes,
    no: newNo,
    accuracy: newAccuracy.toFixed(1) // Round to 1 decimal place
  });
  
  // Update credit level based on user performance
  const completedTasks = newTotal;
  const remainingQuota = sampleData.samples.length - completedTasks;
  
  // Calculate trust score (0-100) based on accuracy and number of completed tasks
  // More weight on accuracy (70%) and some weight on completion (30%)
  const trustScore = (newAccuracy * 0.7) + ((completedTasks / sampleData.samples.length) * 100 * 0.3);
  
  // Determine level based on trust score
  let level = "Beginner";
  if (trustScore >= 90) {
    level = "Expert";
  } else if (trustScore >= 70) {
    level = "Advanced";
  } else if (trustScore >= 50) {
    level = "Intermediate";
  }
  
  // Update credit level
  setCreditLevel({
    accuracy: newAccuracy.toFixed(1),
    level: level,
    completedTasks: completedTasks,
    remainingQuota: remainingQuota,
    trustScore: trustScore.toFixed(1),
    isGenuineUser: true // This could be updated based on validation results
  });
  
  // Move to next sample if not at the end
  if (newTotal <= sampleData.samples.length) {
    const nextSample = sampleData.samples[newTotal - 1];
    setCurrentSample({
      id: nextSample.id,
      number: newTotal,
      total: sampleData.samples.length,
      data: {
        user_query: nextSample.user_query,
        response_fragment: nextSample.response_fragment
      }
    });
  }
  
  // Check if we need to validate the user (e.g., after every 5 labelings)
  if (updatedHistory.length % 5 === 0 && updatedHistory.length > 0) {
    setUserValidationInProgress(true);
    
    // Get the last 5 items for validation
    const recentHistory = updatedHistory.slice(-5);
    
    // Call validation service
    validateUserAuthenticity(recentHistory)
      .then(result => {
        setValidationResult(result);
        
        // Update isGenuineUser based on validation result
        setCreditLevel(prevLevel => ({
          ...prevLevel,
          isGenuineUser: result.isGenuineUser
        }));
        
        setUserValidationInProgress(false);
      })
      .catch(error => {
        console.error("Validation error:", error);
        setUserValidationInProgress(false);
      });
  }
};  return (
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