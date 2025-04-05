import axios from 'axios';
import { formatLabelingHistory } from '../utils/sampleUtils';

// Replace with your actual Claude API key and endpoint
const CLAUDE_API_KEY = 'your_claude_api_key';
const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';

/**
 * Validates user authenticity by sending labeling data to Claude AI
 * @param {Array} labelingHistory - Array of user's last 5 labeling activities
 * @returns {Promise<Object>} - Claude's assessment of user authenticity
 */
export const validateUserAuthenticity = async (labelingHistory) => {
  try {
    // For development/testing, return a mock response
    // In production, uncomment the API call below
    
    // Mock response for development
    console.log("Would validate user with history:", labelingHistory);
    return {
      isGenuineUser: Math.random() > 0.2, // 80% chance of being genuine for testing
      confidenceScore: Math.floor(Math.random() * 30) + 70,
      reasoning: "This is a mock validation response. In production, Claude AI would analyze the labeling patterns."
    };
    
    /*
    const formattedHistory = formatLabelingHistory(labelingHistory);
    
    const prompt = `
      I need you to analyze if this user is a genuine human labeler or potentially a bot/automated system.
      
      Here are the last 5 samples they labeled, with the query, response fragment, and their label (yes/no):
      
      ${formattedHistory}
      
      Based on this labeling pattern, please assess:
      1. Is there evidence of random or inconsistent labeling?
      2. Are there patterns that suggest automated responses rather than thoughtful human judgment?
      3. What is the likelihood this is a genuine human labeler?
      
      Provide your assessment as a JSON object with these fields:
      - isGenuineUser (boolean)
      - confidenceScore (number between 0-100)
      - reasoning (string)
    `;

    const response = await axios.post(
      CLAUDE_API_ENDPOINT,
      {
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Parse Claude's response to extract the JSON assessment
    const claudeResponse = response.data.content[0].text;
    const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Failed to parse Claude's response");
    }
    */
  } catch (error) {
    console.error("Error validating user with Claude:", error);
    return {
      isGenuineUser: true, // Default to true in case of API failure
      confidenceScore: 50,
      reasoning: "Error occurred during validation"
    };
  }
};