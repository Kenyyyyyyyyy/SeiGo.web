<template>
  <div class="news-list-container">
    <div class="news-list-header">
      <h1 class="page-title">ニュース一覧</h1>
      <p class="page-subtitle">最新の活動報告やニュースをお届けします</p>
    </div>

    <main class="news-grid-wrapper">
      <el-row :gutter="30" v-loading="loading">
        <el-col 
          :xs="24" :sm="12" :md="8" 
          v-for="item in blogs" 
          :key="item.id" 
          class="card-col"
        >
          <el-card class="blog-card" :body-style="{ padding: '0px' }" @click="goToDetail(item.id)">
            <div class="card-image-wrapper">
              <img :src="item.coverImageUrl || '/images/default-cover.jpg'" class="card-image" />
              <div class="card-category">{{ item.typeName }}</div>
            </div>
            
            <div class="card-content">
              <div class="card-date">{{ formatNewsDate(item.displayDate) }}</div>
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-summary">{{ item.summary }}</p>
              <div class="card-footer">
                <span class="read-more">詳細を見る <el-icon><ArrowRight /></el-icon></span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="totalCount"
          @current-change="handlePageChange"
          background
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBlogByPage } from '../http/blogService'
import { ArrowRight } from '@element-plus/icons-vue'

interface BlogItem {
  id: number;
  title: string;
  summary: string;
  coverImageUrl: string;
  displayDate: string;
  typeName: string;
}

const router = useRouter()
const loading = ref(false)
const blogs = ref<BlogItem[]>([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(9) // 每页显示9条，适合3列布局

const fetchBlogs = async () => {
  loading.value = true
  try {
    const res = await getBlogByPage(currentPage.value, pageSize.value)
    if (res.resultCode === 200) {
      blogs.value = res.resultData
      totalCount.value = res.count
    }
  } catch (error) {
    console.error('Failed to load blogs:', error)
  } finally {
    loading.value = false
    // 换页后自动回到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchBlogs()
}

const goToDetail = (id: number) => {
  router.push(`/blog/${id}`)
}

const formatNewsDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

onMounted(fetchBlogs)
</script>

<style scoped>
.news-list-container {
  background-color: #fcfcfc;
  min-height: 100vh;
}

.news-list-header {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0));
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.news-grid-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 80px;
}

.card-col {
  margin-bottom: 30px;
}

.blog-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  height: 100%;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important;
}

.card-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
}

.card-content {
  padding: 20px;
}

.card-date {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 12px;
  color: #222;
  /* 标题最多显示两行 */
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  /* 摘要最多显示三行 */
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.read-more {
  color: #007bff;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-section {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}
</style>