import { defineStore } from 'pinia';
import axiosInstance from '../http/index';
import { jwtDecode } from 'jwt-decode'; // 导入辅助库

// 这是一个 helper 接口，用于定义从 token 中解码出来的用户信息
interface UserInfo {
  id: string;
  username: string;
  email: string;
  // 对应你 C# 代码中的 new Claim("username", author.Nickname) 等
}

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    token: null as string | null,
    user: null as UserInfo | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    // 你可以在这里添加其他 getters，比如 isAdmin 等
  },

  actions: {
    /**
     * 登录操作
     * @param credentials - 包含 useremail 和 userpwd
     */
    async login(credentials: { useremail: string; userpwd: string }) {
      try {
        // 1. 准备表单数据
        const params = new URLSearchParams();
        params.append('useremail', credentials.useremail);
        params.append('userpwd', credentials.userpwd);

        // 2. 调用后端 API
        // Axios 会认为 200 OK 是一个 'success'，所以不会抛出错误   
        const response = await axiosInstance.post(
          '/api/Authoize/Login', 
          params, 
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );

        // --- (!!!) 关键修改点在这里 (!!!) ---

        // 3. 检查后端业务逻辑是否成功 (根据 ApiResultHelper)
        if (response.data && response.data.resultCode === 200) {
          
          // 4. 从 'resultData' (而不是 'data') 中获取 token
          const token = response.data.resultData; 

          if (token) {
            // 5. 存储 Token
            this.token = token;
            
            // 6. 设置 Axios 默认请求头
            this.setAuthHeader(token);

            // 7. 解码 Token 并存储用户信息
            this.user = jwtDecode(token);

            return true; // (!!!) 返回 true，LoginPage 将会跳转
          }
        }
        
        // 8. 如果 resultCode 不是 200，或者没有 token，登录失败
        // 我们可以打印出后端返回的错误信息
        console.error("登录业务失败:", response.data.message || '后端未返回Token');
        return false; // (!!!) 返回 false，LoginPage 将显示错误

      } catch (error) {
        // 这个 catch 块现在主要处理网络错误 (例如 500, 404)
        console.error("登录API调用失败 (网络或服务器错误):", error);
        return false; // 登录失败
      }
    },

    /**
     * 退出登录
     */
    logout() {
      this.token = null;
      this.user = null;
      this.setAuthHeader(null); // 移除请求头
      // 你可能还想跳转到登录页
      // router.push('/login');
    },

    /**
     * (关键) 设置 Axios 实例的默认 Authorization
     * @param token 
     */
    setAuthHeader(token: string | null) {
      if (token) {
        // [步骤 4] 所有使用 axiosInstance 的请求都会带上这个头
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        // 退出登录时移除
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
    },
  },

  // 启用持久化 (你已经安装了 pinia-plugin-persistedstate)
  persist: {
    pick: ['token'], // 只持久化 token
  },
});