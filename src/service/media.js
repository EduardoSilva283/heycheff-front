import { API_URL_MEDIA } from "../constants/const";

function fetchMedia(url) {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${window.localStorage.getItem("JWT")}`);
    return fetch(`${API_URL_MEDIA}${url}`, { headers });
}

export async function getBlobMedia(url) {
    const resp = await fetchMedia(url);
    return await resp.blob();
}

export async function displayMedia(url) {
    return URL.createObjectURL(await getBlobMedia(url));
}

export async function displayMediaType(url) {
    const blob = await getBlobMedia(url);
    return [URL.createObjectURL(blob), blob.type];
}