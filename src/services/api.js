const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        if (data.errors) {
          console.error('Validation Errors:', data.errors);
          data.errors.forEach((error, index) => {
            console.error(`Error ${index + 1}: Field "${error.field}" - ${error.message}`);
          });
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL:', url);
      console.error('Request Config:', config);
      throw error;
    }
  }

  // Patient API methods
  async getAllPatients(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/patients${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getPatientById(id) {
    return this.request(`/patients/${id}`);
  }

  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: patientData,
    });
  }

  async updatePatient(id, patientData) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: patientData,
    });
  }

  async deletePatient(id) {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  async getPatientSummary(id) {
    return this.request(`/patients/${id}/summary`);
  }

  // Diet Plan Generation API methods
  async generateDietPlan(patientId) {
    return this.request(`/diet-plans/generate/${patientId}`, {
      method: 'POST',
    });
  }

  async generateDietPlanDirect(patientData) {
    console.log('🚀 API Service: Sending diet plan generation request with patient data:', {
      hasId: !!patientData._id,
      name: patientData.name,
      age: patientData.age
    });
    
    return this.request('/diet-plans/generate-direct', {
      method: 'POST',
      body: { patientData },
    });
  }

  async checkDietPlanServiceHealth() {
    return this.request('/diet-plans/health');
  }

  // Utility methods
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.json();
    } catch (error) {
      console.error('Server health check failed:', error);
      return { success: false, message: 'Server unavailable' };
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for convenience
export const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientSummary,
  generateDietPlan,
  generateDietPlanDirect,
  checkDietPlanServiceHealth,
  checkServerHealth,
} = apiService;
