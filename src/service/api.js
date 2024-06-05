import axios from 'axios';

import { API_URL } from '../constants/const';
import authenticate from './auth';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(config => {
    const expiration = window.localStorage.getItem("expiration");
    let currentMillis = new Date().getMilliseconds();

    if (expiration == null || currentMillis >= expiration) {
        let username = window.prompt("Enter a valid username");
        let password = window.prompt("Enter a valid password");
        authenticate(username, password);
    }

    const jwt = window.localStorage.getItem("JWT");
    config.headers.Authorization = `Bearer ${jwt}`;

    return config;
});

export default api;