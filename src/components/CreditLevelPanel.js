import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { formatLabelingHistory } from "../utils/sampleUtils";
import { validateUserAuthenticity } from "../services/claudeService";
import "../styles/components/CreditLevelPanel.css";

const CreditLevelPanel = () => {
  const { creditLevel, setShowingCreditLevel, labelingHistory } =
    useContext(AppContext);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const hideCreditLevel = () => {
    setShowingCreditLevel(false);
    setEvaluationResult(null);
  };

  const handleAIEvaluation = async () => {
    setIsLoading(true);

    try {
      // Check if labelingHistory exists and has items
      if (!labelingHistory || labelingHistory.length === 0) {
        setEvaluationResult(
          "No labeling history available. Please label some samples first."
        );
        setIsLoading(false);
        return;
      }
      const labelSequence = labelingHistory;
      const formattedHistory = formatLabelingHistory(labelingHistory);
      const result = await validateUserAuthenticity(
        labelSequence,
        formattedHistory
      );
      setEvaluationResult(result);
    } catch (error) {
      console.error("Error during AI evaluation:", error);
      setEvaluationResult(
        "Error occurred during evaluation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="panel data-panel">
      <div className="panel-title">User Credit Level</div>

      <div className="credit-level-content">
        <div className="credit-title">User: DataLabeler_42</div>

        <div>
          Current Level: <b>{creditLevel.level}</b>
        </div>

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
            <button
              className="ai-evaluation-btn"
              onClick={handleAIEvaluation}
              disabled={isLoading}
            >
              {isLoading ? "Evaluating..." : "AI Evaluation"}
            </button>
          </div>
          <div className="credit-item">
            <span>Trust Score</span>
            <span>
              {evaluationResult && evaluationResult.includes("<trust_score>")
                ? Math.round(
                    parseFloat(
                      evaluationResult
                        .split("<trust_score>")[1]
                        .split("</trust_score>")[0]
                        .trim()
                    ) * 10
                  )
                : 0}
              /100
            </span>
          </div>
        </div>

        <button className="credit-btn" onClick={hideCreditLevel}>
          Return to Labeling
        </button>
      </div>

      {evaluationResult && (
        <div className="evaluation-result-popup">
          <h3>AI Evaluation Result</h3>
          {evaluationResult.includes("<general_thoughts>") ? (
            <>
              <div className="result-section">
                <h4>General Thoughts</h4>
                <p>
                  {evaluationResult
                    .split("<general_thoughts>")[1]
                    .split("</general_thoughts>")[0]
                    .trim()}
                </p>
              </div>
              {evaluationResult.includes("<deep_speculation>") && (
                <div className="result-section">
                  <h4>Deep Speculation</h4>
                  <p>
                    {evaluationResult
                      .split("<deep_speculation>")[1]
                      .split("</deep_speculation>")[0]
                      .trim()}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p>{evaluationResult}</p>
          )}
          <button onClick={() => setEvaluationResult(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CreditLevelPanel;
