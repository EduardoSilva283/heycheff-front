import axios from 'axios';

import { API_URL } from '../constants/const';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(config => {
    const jwt = window.localStorage.getItem("JWT");
    config.headers.Authorization = `Bearer ${jwt}`;
    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = "/login";
    }

    return Promise.reject(error);
});

export default api;