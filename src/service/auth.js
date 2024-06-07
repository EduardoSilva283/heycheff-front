import axios from 'axios';

import { API_URL } from '../constants/const';

const authApi = axios.create({
    baseURL: API_URL,
});

export const authenticate = async (username, password) => {
    authApi.post("/auth", {
        username: username,
        password: password
    }).then(resp => {
        window.localStorage.setItem("JWT", resp.data.token);
        window.localStorage.setItem("expiration", resp.data.expiration);
    })
        .catch(error => console.log("Error authenticating: " + error));
}

export const register = async (email, username, password) => {
    authApi.post("/user", {
        email: email,
        username: username,
        password: password
    }).catch(error => console.log("Error creating user: " + error));
}