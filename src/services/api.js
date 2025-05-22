import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => {
    const user = Cookies.get('user');
    if (!user) return {};
    const parsed = JSON.parse(user);
    return { Authorization: `Bearer ${parsed.token}` };
};

const handleAuthError = (res) => {
    if (res.status === 401 || res.status === 403) {
        Cookies.remove('user');
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
        throw new Error('Unauthorized. Redirecting to login.');
    }
};



export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            Cookies.remove('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const fetchCourses = async () => {
    try {
        const response = await apiClient.get('/api/courses');
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};


export const fetchCourseById = async (id) => {
    try {
        const response = await apiClient.get(`/api/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        throw error;
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await apiClient.get(`/api/users/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    const userStr = Cookies.get('user');
    if (!userStr) {
        throw new Error("No user cookie found");
    }

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (e) {
        console.error("Failed to parse user cookie:", e);
        throw new Error("Invalid user cookie format");
    }

    const res = await fetch(`http://localhost:8080/api/users/${user.user.id}`, {
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
    });

    handleAuthError(res);

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }

    return await res.json();
};


export const updateUser = async (userId, userData, profileImage) => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    if (profileImage) formData.append('profileImage', profileImage);

    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${JSON.parse(Cookies.get('user'))?.token || ''}`
        },
        body: formData
    });

    handleAuthError(response);

    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
};


export const fetchUserCourses = async (id) => {
    try {
        const response = await apiClient.get(`/api/users/${id}/created-courses`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching created courses:', error);
        throw error;
    }
};

export const fetchEnrolledCourses = async (id) => {
    try {
        const response = await apiClient.get(`/api/users/${id}/enrolled-courses`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        throw error;
    }
};

export const enrollInCourse = async (courseId, token) => {
    const response = await fetch(`http://localhost:8080/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    handleAuthError(response);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Enrollment failed');
    }

    return await response.text();
};



