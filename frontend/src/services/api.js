import axios from 'axios';

// آدرس بک‌اند خود را اینجا قرار دهید
const API_URL = process.env.REACT_APP_API_URL || 'https://safety-backend-69dl.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;