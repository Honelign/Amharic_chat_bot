import axios from 'axios';

// Replace with your actual Cloud Run URL
const API_URL = import.meta.env.VITE_API_URL || 'https://amhachat-backend-url-placeholder.a.run.app';

export const analyzeDocument = async (file, userId, language = 'amharic') => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('language', language);
        // originalFileName is handled on the backend from the file object itself

        const response = await axios.post(`${API_URL}/api/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error analyzing document:", error);
        throw error;
    }
};

export const analyzeText = async (text, userId, language = 'amharic') => {
    try {
        const response = await axios.post(`${API_URL}/api/analyze-text`, {
            text,
            userId,
            language
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error analyzing text:", error);
        throw error;
    }
};

