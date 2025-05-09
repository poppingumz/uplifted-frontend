import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => {
    const user = Cookies.get('user');
    if (!user) return {};
    const parsed = JSON.parse(user);
    return { Authorization: `Bearer ${parsed.token}` };
};

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
    const user = JSON.parse(Cookies.get('user'));
    const res = await fetch(`http://localhost:8080/api/users/${user.user.id}`, {
        headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }
    return await res.json();
};


export const updateUser = async (userId, userData, profileImage) => {
    try {
        const formData = new FormData();
        formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
