import { API_URL } from "../constants/const";

export default authenticate = async (username, password) => {
    fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then(resp => resp.json())
        .then(data => {
            window.localStorage.setItem("JWT", data.token);
            window.localStorage.setItem("expiration", data.expiration);
        })
        .catch(err => console.log("Error logging in: ", err));
}