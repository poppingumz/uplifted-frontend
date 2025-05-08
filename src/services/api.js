import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const fetchCourses = async () => {
    try {
        const response = await apiClient.get('/api/courses');
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const fetchUserCourses = async (userId) => {
    try {
        const response = await apiClient.get(`/api/courses/instructor/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user courses:', error);
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
        const response = await apiClient.get(`/api/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/api/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData, profileImage) => {
    try {
        const formData = new FormData();
        formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        const response = await apiClient.put(`/api/users/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};



