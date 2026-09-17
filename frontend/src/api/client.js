// Centralized API Client for ARGUS Backend

const API_BASE_URL = "";

export const fetchAPI = async (endpoint) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw err;
  }
};

export const fetchOverview = () => fetchAPI("/api/overview");
export const fetchEntity = (entityId) => fetchAPI(`/api/entity/${entityId}`);
export const fetchAssets = (entityId) => fetchAPI(`/api/assets/${entityId}`);
export const fetchFinding = (findingId) => fetchAPI(`/api/finding/${findingId}`);
export const fetchCandidateIncident = (incidentId) => fetchAPI(`/api/candidate-incident/${incidentId}`);
export const checkHealth = () => fetchAPI("/api/health");
