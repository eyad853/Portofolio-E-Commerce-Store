import axios from 'axios';

// Assuming your backend is running on this base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Adjust if your API endpoint is different

const analyticsService = {
  getAnalyticsOverview: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAnalyticsOverview`);
      if (!response.data.error) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error fetching analytics overview');
      }
    } catch (error) {
      console.error('Error in getAnalyticsOverview:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getOrdersPerDay: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getOrdersPerDay`);
      if (!response.data.error) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Error fetching orders per day');
      }
    } catch (error) {
      console.error('Error in getOrdersPerDay:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getTopSellingProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getTopSellingProducts`);
      if (!response.data.error) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Error fetching top selling products');
      }
    } catch (error) {
      console.error('Error in getTopSellingProducts:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getSalesDistribution: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getSalesDistribution`);
      // Note: The backend for sales distribution directly returns the result array without an 'error' flag or 'result' key.
      return response.data;
    } catch (error) {
      console.error('Error in getSalesDistribution:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getMonthlyOverview: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getMonthlyOverview`);
      if (!response.data.error) {
        return response.data.result;
      } else {
        throw new Error(response.data.message || 'Error fetching monthly overview');
      }
    } catch (error) {
      console.error('Error in getMonthlyOverview:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

};

export default analyticsService;