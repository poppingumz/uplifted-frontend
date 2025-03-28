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
