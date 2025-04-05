/**
 * Fetches the next sample from the sample data
 * @param {Array} samples - Array of all available samples
 * @param {number} currentIndex - Current sample index
 * @returns {Object} - Next sample object
 */
export const getNextSample = (samples, currentIndex) => {
  const nextIndex = (currentIndex + 1) % samples.length;
  return {
    id: samples[nextIndex].id,
    user_query: samples[nextIndex].user_query,
    response_fragment: samples[nextIndex].response_fragment
  };
};

/**
 * Formats the labeling history for Claude API
 * @param {Array} history - Array of labeling history items
 * @returns {string} - Formatted history string
 */
export const formatLabelingHistory = (history) => {
  if (!Array.isArray(history) || history.length === 0) {
    return "No labeling history available.";
  }
  
  return history.map((item, index) => {
    if (!item) return `Sample ${index + 1}: Invalid data`;
    
    return `
    Sample ${index + 1}:
    User Query: "${item.user_query || 'N/A'}"
    Response Fragment: "${item.response_fragment || 'N/A'}"
    User's Label: ${item.userLabel || 'N/A'}
  `;
  }).join('\n');
};