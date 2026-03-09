import axios from 'axios';

// Create axios instance with extended timeout for long processing
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 300000, // 5 minutes timeout for long audio processing
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Process audio file through the backend
 * @param {Blob} audioBlob - The recorded audio blob
 * @param {function} onStatusChange - Callback to update processing status
 * @returns {Promise<{translatedQuery: string, advice: string}>}
 */
export async function processAudio(audioBlob, onStatusChange) {
  try {
    // Update status to uploading
    onStatusChange?.('uploading');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    // Start the upload
    const response = await apiClient.post('/api/process-audio', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (percentCompleted === 100) {
          onStatusChange?.('translating');
        }
      },
    });

    // Update status based on response processing
    onStatusChange?.('consulting');

    // Simulate a small delay to show consulting status (backend already processed)
    await new Promise(resolve => setTimeout(resolve, 500));

    onStatusChange?.('done');

    return {
      translatedQuery: response.data.translated_query || response.data.translatedQuery,
      advice: response.data.advice || response.data.response,
    };
  } catch (error) {
    onStatusChange?.('error');

    // Handle different error types
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Connection timed out. The audio might be too long. Please try a shorter recording.');
    }

    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      if (status === 413) {
        throw new Error('Audio file is too large. Please record a shorter message.');
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (status === 503) {
        throw new Error('Service temporarily unavailable. Please try again in a moment.');
      }
      throw new Error(error.response.data?.message || 'Failed to process audio. Please try again.');
    }

    if (error.request) {
      // No response received
      throw new Error('Connection weak. Please check your internet and try again.');
    }

    // Something else went wrong
    throw new Error('Something went wrong. Please try again.');
  }
}

export default apiClient;

