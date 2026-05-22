const API_URL = 'https://generalhospitalbackend.vercel.app';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Authentication & Stats
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      }
      return data;
    },
    register: async (name, email, password, role = 'user') => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    getProfile: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getStats: async () => {
      const res = await fetch(`${API_URL}/auth/stats`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getUsers: async () => {
      const res = await fetch(`${API_URL}/auth/users`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Doctors CRUD
  doctors: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/doctors`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    add: async (doctorData) => {
      const res = await fetch(`${API_URL}/doctors`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(doctorData),
      });
      return handleResponse(res);
    },
    update: async (id, doctorData) => {
      const res = await fetch(`${API_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(doctorData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Medicines CRUD
  medicines: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/medicines`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    add: async (medicineData) => {
      const res = await fetch(`${API_URL}/medicines`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(medicineData),
      });
      return handleResponse(res);
    },
    update: async (id, medicineData) => {
      const res = await fetch(`${API_URL}/medicines/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(medicineData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/medicines/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Beds CRUD
  beds: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/beds`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    add: async (bedData) => {
      const res = await fetch(`${API_URL}/beds`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bedData),
      });
      return handleResponse(res);
    },
    toggleOccupancy: async (id, payload) => {
      const res = await fetch(`${API_URL}/beds/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/beds/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },

  // Appointments
  appointments: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getMy: async () => {
      const res = await fetch(`${API_URL}/appointments/my`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (appointmentData) => {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(appointmentData),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    }
  },

  // Duties CRUD
  duties: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/duties`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    add: async (dutyData) => {
      const res = await fetch(`${API_URL}/duties`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(dutyData),
      });
      return handleResponse(res);
    },
    update: async (id, dutyData) => {
      const res = await fetch(`${API_URL}/duties/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(dutyData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/duties/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  }
};
