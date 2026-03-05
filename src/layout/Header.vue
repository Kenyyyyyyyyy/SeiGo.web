<template>
  <header class="navbar">
    <div class="navbar-left" @click="goHome">
      <img src="/images/seigou.jpg" class="logo" />
    </div>

    <nav class="navbar-right">
      <div class="navbar-links">
        <a @click.prevent="scroll('club-intro')">青合クラブ</a>
        <a @click.prevent="scroll('activities')">重要活動</a>
        <a @click.prevent="scroll('news')">ニュース</a>
        <router-link to="/contact" class="nav-item-link">お問い合わせ</router-link>
      </div>

      <div class="navbar-actions">
        <el-icon><Search /></el-icon>
        <router-link to="/login" class="global-site">Login</router-link>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const goHome = () => {
  router.push('/')
}

const scroll = async (id: string) => {
  // 如果不在首页，先跳首页
  if (route.path !== '/') {
    await router.push('/')
    await new Promise(r => setTimeout(r, 50))
  }

  const el = document.getElementById(id)
  if (!el) return

  const y = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top: y, behavior: 'smooth' })
}
</script>

<style scoped>
    .navbar {
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background-color: #000;
  color: white;
  z-index: 10;
  box-sizing: border-box;
}




.logo {
  height: 70px;
  width: auto;
}

.logo-link {
  display: inline-flex;
  align-items: center;
}

.nav-item-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: color 0.3s;
}
.nav-item-link:hover {
  color: #409eff; /* 或者你主题的颜色 */
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right a {
  color: white;
  text-decoration: none;
  font-weight: 300;
  font-size: 1.2rem;
  margin-left: 10px;
  margin-right: 60px;
}

.navbar-right a:hover {
  color: #f4d03f;
}

.nav-icon {
  font-size: 1.2rem;
  vertical-align: middle;
}

.global-site {
  border-left: 1px solid #ccc;
  padding-left: 20px;
}


@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 5px 4% !important;
    
  }

  .navbar-left {
    margin-bottom: 10px;
    margin: auto !important;
  }

  .navbar-right {
    flex-direction: column;
    align-items: flex-start;
    margin: auto !important;
  }

  .navbar-right a {
    margin: 5px 10px 5px 0;
    font-size: 0.95rem !important;
    line-height: 1.2;
    padding: 6px 0;
    margin-right: 20px !important;  
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    /* ✅ 搜索与登录之间用 gap 替代竖线 */
    font-size: 1rem;
    margin: auto !important;
  }

  .nav-item-links {
    flex-wrap: nowrap;
  }
  .nav-item-link {
    width: 100%;       
    display: block;    
    text-align: center;
    flex-wrap: wrap !important;
  }

  .nav-icon {
    margin-right: 10px;
    margin: auto !important;
  }

  .logo {
    height: 44px;
    margin: auto !important;
    
  }

  .global-site {
    padding-left: 20px !important;
    margin: auto !important;
  }
}
</style>