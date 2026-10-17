/**
 * API Service for JobTrack
 * Encapsulates all HTTP calls to the backend REST API.
 * Uses Vite proxy (/api) which forwards requests to http://localhost:5000 in development.
 */

const API_BASE = '/api';

/**
 * Fetch all applications with optional search and status filter query parameters.
 */
export async function getApplications(search = '', status = 'All') {
  const params = new URLSearchParams();
  if (search && search.trim() !== '') params.append('search', search.trim());
  if (status && status !== 'All') params.append('status', status);

  const url = `${API_BASE}/applications${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data || [];
}

/**
 * Create a new application.
 */
export async function createApplication(applicationData) {
  const response = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.message || 'Failed to create application');
  }

  const json = await response.json();
  return json.data;
}

/**
 * Update an existing application or its status.
 */
export async function updateApplication(id, updatedFields) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.message || 'Failed to update application');
  }

  const json = await response.json();
  return json.data;
}

/**
 * Delete an application by ID.
 */
export async function deleteApplication(id) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.message || 'Failed to delete application');
  }

  const json = await response.json();
  return json.data;
}

/**
 * Restore sample applications into the database.
 */
export async function seedApplications() {
  const response = await fetch(`${API_BASE}/applications/seed`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to seed applications');
  }

  const json = await response.json();
  return json.data || [];
}

/**
 * Check backend API health status.
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      const data = await response.json();
      return { online: true, ...data };
    }
  } catch {
    // API server is not running or unreachable
  }
  return { online: false };
}
