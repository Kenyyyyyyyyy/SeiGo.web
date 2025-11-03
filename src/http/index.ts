import axios from 'axios';


const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://seigou-webapi.onrender.com'
    : 'https://localhost:44388');

console.log('[Axios BaseURL]', baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

export default axiosInstance;
