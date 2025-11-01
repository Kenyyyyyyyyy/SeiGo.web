import axios from 'axios';

const axiosInstance = axios.create({
  /**
   * (!!!) 动态 Base URL (!!!)
   * * 'import.meta.env.VITE_API_BASE_URL' 是一个环境变量。
   * * 1. 在生产环境 (npm run build):
   * Vercel/Render 会将这个变量替换为你的 API 域名 
   * (例如: "https://seigo-api.onrender.com").
   * * 2. 在开发环境 (npm run dev):
   * 这个变量是 undefined, 所以会回退到 '/'。
   * 这能让 Vite 代理 (proxy) 正确拦截所有请求。
   */
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  
  timeout: 10000, // 10秒超时
});

export default axiosInstance;