const URL_DEV = "http://localhost:6015/heycheff";
const URL_MEDIA_DEV = "http://localhost:6015/heycheff/media?path=";

const URL_PROD = "http://localhost:6015/heycheff";
const URL_MEDIA_PROD = "http://localhost:6015/heycheff/media?path=";

const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? URL_DEV : URL_PROD;
export const API_URL_MEDIA = isDev ? URL_MEDIA_DEV : URL_MEDIA_PROD;