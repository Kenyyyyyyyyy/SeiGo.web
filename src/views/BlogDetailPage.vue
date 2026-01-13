<template>
  <div class="blog-detail-page">
    <!-- 导航栏 (从 HomePage.vue 复制) -->
    <header class="navbar">
      <div class="navbar-left">
        <img src="/images/seigou.jpg" alt="Logo" class="logo" />
      </div>
      <nav class="navbar-right">
        <div class="navbar-links">
          <a href="#">団体の方へ </a>
          <a href="#">個人の方へ </a>
          <a href="#">団体情報 </a>
        </div>
        <div class="navbar-actions">
          <a href="#" class="nav-icon">
            <el-icon>
              <Search />
            </el-icon>
          </a>
          <a href="/login" class="global-site">Login</a>
        </div>
      </nav>
    </header>

    <!-- 博客详情内容区域 -->
    <main class="blog-content-main" v-loading="isLoading">
      <div v-if="blog">
        <h1 class="blog-title">{{ blog.title }}</h1>
        <div class="blog-meta">
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            {{ formatNewsDate(blog.displayDate) }}
          </span>
          <span class="meta-item">
            <el-icon><User /></el-icon>
            {{ blog.authorname }}
          </span>
          <span class="meta-item category-badge">{{ blog.typeName || '未分类' }}</span>
        </div>

        <div class="blog-cover-image-container" v-if="blog.coverImageUrl">
          <img :src="blog.coverImageUrl" alt="Cover Image" class="blog-cover-image" />
        </div>

        <!-- 使用 v-html 渲染后端返回的 HTML 内容 -->
        <div class="blog-html-content" v-html="blog.content"></div>

        <div class="back-link">
          <router-link to="/">
            <el-icon><ArrowLeft /></el-icon>
            ニュース一覧に戻る
          </router-link>
        </div>
      </div>
      <div v-else-if="!isLoading" class="not-found">
        <h2>新闻未找到或加载失败。</h2>
        <router-link to="/">返回首页</router-link>
      </div>
    </main>

    <!-- 页脚 (从 HomePage.vue 复制) -->
    <footer class="footer">
      <div class="footer-row-1">
        <a href="#">ニュース</a>
        <a href="#">サイト更新情報</a>
        <a href="#">RSSについて</a>
        <a href="#">ソーシャルメディアアカウント</a>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-row-2">
        <div class="footer-links-secondary">
          <a href="#">お問い合わせ</a>
          <a href="#">個人情報保護について</a>
          <a href="#">利用規約</a>
          <a href="#">クッキーノーティス</a>
        </div>
        <div class="copyright">
          <p>東京青合クラブ</p>
          <p>© 2025 TOKYO SEIGO CLUB</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getBlogById } from '../http/blogService';
import { Search, Calendar, User, ArrowLeft } from "@element-plus/icons-vue";

// 复制 BackendBlog 接口定义，避免循环依赖或修改 blogService.ts
interface BackendBlog {
  id: number;
  title: string;
  summary: string;
  displayDate: string;
  typeName: string;
  authorname: string;
  coverImageUrl: string;
  content: string;
  typeId: number | null;
  pinnedTime: string | null;
}

const route = useRoute();
const blog = ref<BackendBlog | null>(null);
const isLoading = ref(true);

const formatNewsDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

onMounted(async () => {
  const id = route.params.id;
  if (id && !isNaN(Number(id))) {
    try {
      const blogData = await getBlogById(Number(id));
      blog.value = blogData;
    } catch (error) {
      console.error("获取博客详情失败:", error);
    }
  }
  isLoading.value = false;
});
</script>

<style scoped>
/* ------------------------------------------------------------------- */
/* 从 HomePage.vue 复制的样式 - 导航栏和页脚 */
/* ------------------------------------------------------------------- */

.blog-detail-page {
  font-family: 'Noto Sans JP', sans-serif;
  color: #333;
}

/* 顶部导航栏 */
.navbar {
  position: fixed;
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

/* 页脚 */
.footer {
  background: #111;
  color: #ccc;
  padding: 40px 10%;
  text-align: left;
}

.footer-row-1 {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 25px;
}

.footer a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 300;
  transition: color 0.2s;
}

.footer a:hover {
  color: white;
}

.footer-divider {
  border-top: 1px solid #333;
  margin: 20px 0;
}

.footer-row-2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-links-secondary {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright {
  text-align: right;
  font-size: 0.8rem;
  color: #aaa;
  white-space: nowrap;
}

.copyright p {
  margin: 0;
  line-height: 1.4;
}

/* ------------------------------------------------------------------- */
/* 博客详情页特有样式 */
/* ------------------------------------------------------------------- */

.blog-content-main {
  padding: 120px 10% 80px; /* 顶部留出导航栏空间 */
  min-height: 80vh;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
  color: #222;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  color: #666;
  font-size: 0.9rem;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .el-icon {
  margin-right: 5px;
  font-size: 1.1rem;
}

.category-badge {
  background-color: #eee;
  color: #555;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.blog-cover-image-container {
  margin-bottom: 30px;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.blog-cover-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.blog-html-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
}

/* 确保 v-html 渲染的内容样式良好 */
.blog-html-content :deep(p) {
  margin-bottom: 1.5em;
}

.blog-html-content :deep(h1),
.blog-html-content :deep(h2),
.blog-html-content :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  font-weight: 600;
  color: #222;
}

.blog-html-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 4px;
}

.back-link {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.back-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.back-link a:hover {
  text-decoration: underline;
}

.back-link .el-icon {
  margin-right: 5px;
}

.not-found {
  text-align: center;
  padding: 100px 0;
}

.not-found h2 {
  color: #e6a23c;
  margin-bottom: 20px;
}

/* 移动端适配 */
@media (max-width: 767px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 5px 4% !important;
  }

  .navbar-left {
    margin-bottom: 10px;
  }

  .navbar-right {
    flex-direction: column;
    align-items: flex-start;
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
  }

  .nav-icon {
    margin-right: 10px;
  }

  .logo {
    height: 44px;
    margin-top: 4px;
  }

  .blog-content-main {
    padding: 180px 5% 40px; /* 调整顶部内边距以适应移动端导航栏高度 */
  }

  .blog-title {
    font-size: 1.8rem;
  }

  .blog-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .blog-html-content {
    font-size: 1rem;
  }
}
</style>