import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';

// —————————————————————————————————————————————
// Create Axios instance
// —————————————————————————————————————————————
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request if present
apiClient.interceptors.request.use(
  config => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        const { token } = JSON.parse(userStr);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {}
    }
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && [401, 403].includes(error.response.status)) {
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// —————————————————————————————————————————————
// Auth
// —————————————————————————————————————————————
export const login = async (email, password) => {
  const { data } = await apiClient.post('/api/auth/login', { email, password });
  return data;
};

export const register = async user => {
  const { data } = await apiClient.post('/api/auth/register', user);
  return data;
};

// —————————————————————————————————————————————
// Courses
// —————————————————————————————————————————————
export const fetchCourses = async () => {
  const { data } = await apiClient.get('/api/courses');
  return data;
};

export const fetchFilteredCourses = async (title, category, sort, page) => {
  const params = new URLSearchParams();
  if (title) params.append('title', title);
  if (category) params.append('category', category);
  if (sort) params.append('sort', sort);
  if (page !== undefined) params.append('page', page);

  const res = await fetch(`http://localhost:8080/api/courses/filter?${params}`);
  if (!res.ok) throw new Error('Failed to fetch filtered courses');
  return res.json(); 
};


export const fetchCourseById = async id => {
  const { data } = await apiClient.get(`/api/courses/${id}`);
  return data;
};

export const fetchPassedQuizzes = async (userId) => {
  const cookie = Cookies.get('user');
  const token = cookie ? JSON.parse(cookie).token : null;

  const res = await fetch(`http://localhost:8080/api/quizzes/passed?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) throw new Error('Failed to fetch passed quizzes');
  return await res.json();
};



export const fetchUserCourses = async instructorId => {
  const { data } = await apiClient.get(`/api/courses/instructor/${instructorId}`);
  return data;
};

export const fetchEnrolledCourses = async userId => {
  const { data } = await apiClient.get(`/api/users/${userId}/enrolled-courses`);
  return data;
};

export const enrollInCourse = async courseId => {
  const { data } = await apiClient.post(`/api/courses/${courseId}/enroll`);
  return data;
};

export const unenrollFromCourse = async courseId => {
  const { data } = await apiClient.delete(`/api/courses/${courseId}/enroll`);
  return data;
};

export const deleteCourse = async courseId => {
  const { data } = await apiClient.delete(`/api/courses/${courseId}`);
  return data;
};


// —————————————————————————————————————————————
// User
// —————————————————————————————————————————————
export const getCurrentUser = async () => {
  const userStr = Cookies.get('user');
  if (!userStr) throw new Error('No user cookie found');
  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    throw new Error('Invalid user cookie format');
  }
  const { data } = await apiClient.get(`/api/users/${user.id}`);
  return data;
};

export const fetchUserById = async userId => {
  const { data } = await apiClient.get(`/api/users/${userId}`);
  return data;
};

export const updateUser = async (userId, userData, profileImage) => {
  const formData = new FormData();
  formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }
  const { data } = await apiClient.put(`/api/users/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// —————————————————————————————————————————————
// Files
// —————————————————————————————————————————————
export const downloadFile = async (fileId, fileName) => {
  const userStr = Cookies.get('user');
  const token = userStr ? JSON.parse(userStr).token : null;

  const response = await axios.get(`http://localhost:8080/api/files/${fileId}/download`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob'
  });

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};



// —————————————————————————————————————————————
// Quizzes
// —————————————————————————————————————————————
export const createQuiz = async quizData => {
  const { data } = await apiClient.post('/api/quizzes', quizData);
  return data;
};

export const fetchUserQuizzes = async userId => {
  const { data } = await apiClient.get(`/api/quizzes/creator/${userId}`);
  return data;
};

export const deleteQuiz = async quizId => {
  const { data } = await apiClient.delete(`/api/quizzes/${quizId}`);
  return data;
};

export const fetchQuizById = async quizId => {
  const { data } = await apiClient.get(`/api/quizzes/${quizId}`);
  return data;
};

export const updateQuiz = async (quizId, quizData) => {
  const { data } = await apiClient.put(`/api/quizzes/${quizId}`, quizData);
  return data;
};
