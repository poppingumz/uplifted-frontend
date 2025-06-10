import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';

// Create Axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor to attach Authorization header if token exists and route is protected
apiClient.interceptors.request.use(config => {
    const publicPaths = ['auth/login', 'auth/register', 'courses'];

    // Match the end of path or partials (covers all scenarios)
    const url = config.url?.toLowerCase();

    const isPublic = publicPaths.some(path =>
        url && url.includes(path)
    );

    if (!isPublic) {
        const userStr = Cookies.get('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    }

    return config;
}, error => Promise.reject(error));


// Interceptor for handling 401/403 errors
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Cookies.remove('user');
            // if (!window.location.pathname.includes('/login')) {
            //     window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

// ============== API Calls ==============

export const login = async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
};

export const register = async (user) => {
    const response = await apiClient.post('/api/auth/register', user);
    return response.data;
};

export const fetchCourses = async () => {
    const response = await apiClient.get('/api/courses');
    return response.data;
};

export const fetchCourseById = async (id) => {
    const response = await apiClient.get(`/api/courses/${id}`);
    return response.data;
};

export const fetchUserById = async (userId) => {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
};

export const getCurrentUser = async () => {
    const userStr = Cookies.get('user');
    if (!userStr) throw new Error("No user cookie found");

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (e) {
        console.error("❌ Failed to parse user cookie:", e);
        throw new Error("Invalid user cookie format");
    }

    const response = await apiClient.get(`/api/users/${user.id}`);
    return response.data;
};


export const updateUser = async (userId, userData, profileImage) => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    if (profileImage) formData.append('profileImage', profileImage);

    const response = await apiClient.put(`/api/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const fetchUserCourses = async (id) => {
  const response = await apiClient.get(`/api/courses/instructor/${id}`);
  return response.data;
};

export const fetchEnrolledCourses = async (id) => {
    const response = await apiClient.get(`/api/users/${id}/enrolled-courses`);
    return response.data;
};

export const enrollInCourse = async (courseId) => {
    const response = await apiClient.post(`/api/courses/${courseId}/enroll`);
    return response.data;
};

export async function deleteCourse(courseId, token) {
    const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete course: ${response.status}`);
    }
}

export const createQuiz = async (quizData) => {
    const response = await apiClient.post('/api/quizzes', quizData);
    return response.data;
};

export const fetchUserQuizzes = async (userId) => {
    const cookie = Cookies.get('user');
    const token = cookie ? JSON.parse(cookie).token : '';
    const res = await fetch(`http://localhost:8080/api/quizzes/creator/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error('Failed to fetch quizzes');
    return res.json();
};

export async function deleteQuiz(quizId, token) {
    const response = await fetch(`http://localhost:8080/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete quiz: ${response.status}`);
    }
}

export const fetchQuizById = async (quizId) => {
    const response = await apiClient.get(`/api/quizzes/${quizId}`);
    return response.data;
};

export const updateQuiz = (quizId, quizData, token) => {
  return axios.put(`${API_BASE_URL}/api/quizzes/${quizId}`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};




