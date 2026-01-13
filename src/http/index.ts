import axios from 'axios';


const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://seigou-webapi.onrender.com'
    : 'https://localhost:44388');

console.log('[Axios BaseURL]', baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 60000, // 增加超时时间至 60 秒，以应对后端系统唤醒延迟
});

export default axiosInstance;
