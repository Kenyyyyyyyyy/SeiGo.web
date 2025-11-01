<template>
  <div class="admin-page-container">
    <div class="admin-header">
      <h1>管理员后台</h1>
      <div class="admin-header-buttons">
        <router-link to="/">
          <el-button type="primary">返回主页</el-button>
        </router-link>
        <el-button type="danger" :icon="SwitchButton" @click="handleLogout">
          退出登录
        </el-button>
      </div>
    </div>
    <div v-if="authStore.user" class="user-info">
      <p>欢迎您, <strong>{{ authStore.user.username }}</strong>！</p>
    </div>

    <el-divider />

    <h2>快速操作</h2>
    <div class="actions">
      <router-link to="/AdminPage/create-blog">
        <el-button type="primary" size="large">
          <el-icon><Plus /></el-icon>
          创建新文章
        </el-button>
      </router-link>

      <router-link to="/AdminPage/manage">
        <el-button type="default" size="large">
          <el-icon><Files /></el-icon>
          管理所有文章
        </el-button>
      </router-link>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/authStore';
import { Plus, SwitchButton, Files } from '@element-plus/icons-vue'; // (!!!) 修复：添加了 Files (!!!)
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();
const router = useRouter(); // 4. 实例化 router

// 5. 新增：handleLogout 方法
const handleLogout = () => {
  // 调用 store 中的 action
  authStore.logout();
  
  // 提示用户
  ElMessage.success('您已成功退出登录。');
  
  // 跳转到登录页
  router.push('/login');
};
</script>

<style scoped>
.admin-page-container {
  padding: 40px;
  max-width: 900px;
  margin: 20px auto;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 6. 新增：header 样式 */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
}
.admin-header h1 {
  margin: 0; /* 移除 h1 的默认外边距 */
}

.user-info {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 4px;
}

.admin-header-buttons {
 display: flex;
 gap: 10px;
 align-items: center;
}

.actions {
 display: flex;
 gap: 20px;
}

.el-button .el-icon {
  margin-right: 8px;
}
</style>