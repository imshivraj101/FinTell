import axios from 'axios';
import { ApiResponse } from '../components/LegalAdvisor';

// Configure base URL - can be overridden by environment variables
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - the server took too long to respond');
    }
    
    if (error.response) {
      // Server responded with error status
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.detail || error.response.data?.message || 'Unknown server error';
      
      switch (statusCode) {
        case 400:
          throw new Error(`Bad Request: ${errorMessage}`);
        case 404:
          throw new Error('API endpoint not found - please check if the backend server is running');
        case 500:
          throw new Error(`Server Error: ${errorMessage}`);
        default:
          throw new Error(`HTTP ${statusCode}: ${errorMessage}`);
      }
    } else if (error.request) {
      // Network error - no response received
      throw new Error('Network error - cannot connect to the backend server. Please ensure the backend is running on ' + BASE_URL);
    } else {
      // Other error
      throw new Error(`Request failed: ${error.message}`);
    }
  }
);

export interface QuestionRequest {
  question: string;
}

/**
 * Send a legal question to the InLaw API and get a response
 */
export const askLegalQuestion = async (question: string): Promise<ApiResponse> => {
  try {
    const requestData: QuestionRequest = { question };
    
    const response = await apiClient.post<ApiResponse>('/ask', requestData);
    
    // Validate response structure
    if (!response.data.answer) {
      throw new Error('Invalid response format - missing answer');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error asking legal question:', error);
    throw error;
  }
};

/**
 * Check if the backend server is healthy
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200 && response.data?.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Get basic info about the API
 */
export const getApiInfo = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error('Error getting API info:', error);
    throw error;
  }
};