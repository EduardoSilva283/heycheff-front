import axios from 'axios';

import { API_URL } from '../constants/const';

const authApi = axios.create({
    baseURL: API_URL,
});

export async function authenticate(username, password) {
    const status = authApi.post("/auth", {
        username: username,
        password: password
    }).then(resp => {
        window.localStorage.setItem("JWT", resp.data.token);
        window.localStorage.setItem("expiration", resp.data.expiration);
        window.localStorage.setItem("userId", resp.data.userId);
        return resp.status;
    })
        .catch(error => console.log("Error authenticating: " + error));

    return status;
}

export async function register(email, username, password) {
    const status = authApi.post("/user", {
        email: email,
        username: username,
        password: password
    }).then(resp => resp.status)
        .catch(error => console.log("Error creating user: " + error));

    return status;
}