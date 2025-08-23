import axios from 'axios';

const api = axios.create({
    baseURL: 'https://patient-managment-backend.vercel.app',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
