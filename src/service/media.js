import { API_URL_MEDIA } from "../constants/const";

function fetchMedia(url) {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${window.localStorage.getItem("JWT")}`);
    return fetch(`${API_URL_MEDIA}${url}`, { headers });
}

export async function displayMedia(url) {
    const resp = await fetchMedia(url);
    const blob = await resp.blob();
    return URL.createObjectURL(blob);
}

export async function getBlobMedia(url) {
    const resp = await fetchMedia(url);
    const blob = await resp.blob();
    return blob;
}

export async function displayMediaType(url) {
    const resp = await fetchMedia(url);
    const blob = await resp.blob();
    return [URL.createObjectURL(blob), blob.type];
}