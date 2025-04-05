// Replace with your actual Claude API key and endpoint

/**
 * Validates user authenticity using Claude API
 * @param {Array} labelSequence - Array of boolean values representing user's labeling choices
 * @param {string|Array} labelingHistory - Formatted history of user's labeling activity
 * @returns {Promise<string>} - Claude's evaluation of user authenticity
 */
export const validateUserAuthenticity = async (
  labelSequence,
  labelingHistory
) => {
  try {
    // Handle empty history case
    if (!labelSequence || labelSequence.length === 0) {
      return "Not enough labeling data to evaluate user behavior.";
    }

    // Format the history for Claude API - ensure it's a string
    let formattedHistory = labelingHistory;

    // If labelingHistory is an array, format it
    if (Array.isArray(labelingHistory)) {
      formattedHistory = labelingHistory
        .map(
          (item, index) => `
        Sample ${index + 1}:
        User Query: "${item.user_query || ""}"
        Response Fragment: "${item.response_fragment || ""}"
        User's Label: ${item.userLabel || "unknown"}
      `
        )
        .join("\n");
    }

    // This is a placeholder for the actual API call to Claude
    const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;

    if (!apiKey) {
      console.warn("Claude API key not found. Using mock response.");
      // Return a mock response for development/testing
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            "Based on the labeling pattern, the user appears to be labeling data honestly. The mistakes seem to be genuine errors rather than malicious intent. There's no clear pattern of deliberate incorrect labeling."
          );
        }, 500);
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "anthropic-dangerous-direct-browser-access": "true",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `
            You are an advanced AI system designed to analyze user behavior in data labeling tasks. Your goal is to determine whether a user is labeling data honestly or potentially engaging in malicious behavior. You will be provided with a sequence of their correct/incorrect labels and a detailed history of their labeling activity.

            First, review the following information:

            1. Detailed history of labeling activity:
            <labeling_history>
            ${formattedHistory}
            </labeling_history>

            2. Label sequence (true = correct, false = incorrect):
            <label_sequence>
            ${JSON.stringify(labelSequence)}
            </label_sequence>

            Your task is to analyze this information and provide an assessment of the user's labeling behavior. Use the following research-based methods to guide your analysis:

            1. Consistency Analysis: Look for patterns in the user's labeling behavior over time.
            2. Time-based Analysis: Consider the time spent on each label and any unusual patterns.
            3. Error Distribution: Analyze the distribution of errors and compare it to expected random error rates.
            4. Sequential Dependency: Check for suspicious patterns in the sequence of correct and incorrect labels.

            Conduct your analysis inside the following tags:

            <detailed_analysis>
            In this section, break down your thought process step-by-step. Consider the following questions:
            1. What is the overall accuracy rate of the user's labels? (Calculate this explicitly)
            2. Are there any noticeable patterns in the labeling sequence or history? (List these out)
            3. How does the user's performance compare to expected random chance? (Provide calculations)
            4. Are there any signs of fatigue, rushing, or inconsistent effort?
            5. Do any mistakes appear to be honest errors or potentially deliberate?
            6. Is there evidence of the user not paying attention or deliberately providing wrong answers?

            Use the research-based methods mentioned above to support your analysis. Include explicit calculations and observations where relevant. It's OK for this section to be quite long.
            </detailed_analysis>

            <general_thoughts>
            Provide a concise summary of the user's overall labeling accuracy and status. Include a general assessment of whether the user appears to be labeling honestly or potentially engaging in malicious behavior. Provide a confidence level for your assessment (e.g., low, medium, high) based on the available evidence.
            </general_thoughts>

            <deep_speculation>
            In this section, provide a more detailed analysis of the user's labeling behavior:
            1. If the user made mistakes, identify potential reasons why these mistakes occurred. Consider factors such as task difficulty, user expertise, fatigue, or potential misunderstandings of instructions.
            2. Speculate on any patterns or anomalies you've noticed in the labeling sequence or history. What might these patterns suggest about the user's approach or intentions?
            3. Discuss any potential alternative explanations for the user's behavior that don't involve malicious intent.
            4. If you suspect malicious behavior, what specific evidence supports this conclusion, and how confident are you in this assessment?

            Ensure that your deep speculation is grounded in the data provided and the analysis you've conducted.
            </deep_speculation>
            <trust_score>
            Based on a score from 1 to 10, calculate this user's trust score using the scores from the <deep_speculation> and <general_thoughts> tags.
            The final score may include up to two decimal places. Weight <deep_speculation> at 60% and <general_thoughts> at 40% in the calculation.
            Do not provide any explanations or comments in this section. Respond strictly with a number.
            </trust_score>
            Remember to maintain objectivity throughout your analysis and clearly distinguish between factual observations and speculative interpretations.
            For each <trust_score>,<deep_speculation> and <general_thoughts>, each sections must be less than 200 tokens each.
            `,
          },
        ],
      }),
    });
    console.log(formattedHistory);
    const data = await response.json();
    console.log(data);
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return "Unable to evaluate user behavior at this time. Please try again later.";
  }
};
