import axios from 'axios';

// Replace with your actual Cloud Run URL
const API_URL = import.meta.env.VITE_API_URL || 'https://amhachat-backend-url-placeholder.a.run.app';

export const analyzeDocument = async (file, userId) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
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
