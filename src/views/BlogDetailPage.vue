<template>
  <div class="blog-detail-page">
    

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
          <a @click.prevent="goBack" class="back-button-link">
            <el-icon><ArrowLeft /></el-icon>
            前のページに戻る
          </a>
        </div>
      </div>
      <div v-else-if="!isLoading" class="not-found">
        <h2>新闻未找到或加载失败。</h2>
        <router-link to="/">返回首页</router-link>
      </div>
    </main>

    
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
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

const router = useRouter();
const route = useRoute()
const blog = ref<BackendBlog | null>(null);
const isLoading = ref(true);

const goBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/') // 如果没有历史记录，默认回主页
  }
}

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


.blog-detail-page {
  font-family: 'Noto Sans JP', sans-serif;
  color: #333;
}


/* 页脚 */


/* ------------------------------------------------------------------- */
/* 博客详情页特有样式 */
/* ------------------------------------------------------------------- */

.blog-content-main {
  padding: 10px 10% 80px; /* 顶部留出导航栏空间 */
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
  /* 将 height: auto 改为固定高度或 100% */
  height: 400px; 
  /* object-fit: cover 会确保图片比例不失真并填满空间 */
  object-fit: cover;
  /* 确保图片以中心对齐，不会只看到头部 */
  object-position: center; 
  display: block;
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

.blog-html-content :deep(iframe),
.blog-html-content :deep(video) {
  display: block;
  margin: 40px auto !important; /* 强制水平居中并增加上下间距 */
  width: 100% !important;        /* 响应式宽度 */
  max-width: 850px !important;   /* 电脑端最大宽度 */
  aspect-ratio: 16 / 9;          /* 锁定 16:9 比例 */
  height: auto !important;       /* 覆盖掉 YouTube 默认的 height="315" */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: none;
}

/* 处理不支持 aspect-ratio 的旧浏览器 */
@supports not (aspect-ratio: 16 / 9) {
  .blog-html-content :deep(iframe) {
    height: 480px; 
  }
}

/* 移动端适配 */
@media (max-width: 767px) {
  
  
  /* ... 这里保留你之前的其他移动端样式 ... */

  .blog-content-main {
    padding: 10px 5% 40px; 
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

  /* 移动端微调：减小视频边距 */
  .blog-html-content :deep(iframe) {
    margin: 20px auto !important;
  }
}
</style>