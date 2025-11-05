<template>
  <div class="home">
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

    <section class="hero">
      <div class="hero-item" v-for="(item, index) in heroItems" :key="index">
        <img :src="item.image" class="hero-img" />
        <div class="hero-overlay">
          <h2>{{ item.title }}</h2>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>
    </section>

    <section class="memorial">
      <img src="/images/2025 花冈.jpg" alt="memorial" />
      <div class="memorial-text">
        <h2>2025<br>&nbsp;&nbsp; 花岡平和記念</h2>
      </div>
    </section>

    <section class="cards">
      <h2 class="section-title">活動・プロジェクト</h2>

      <el-row :gutter="40" v-loading="isLoadingActivities">
        <el-col :xs="24" :sm="12" :md="12" class="card-wrapper" v-for="activity in activities" :key="activity.id">
          <el-card class="card-item" shadow="hover">
            <div class="card-img-container">
              <img :src="activity.coverImageUrl" class="card-img" />

              <a :href="`/blog/${activity.id}`" class="card-button-overlay">
                詳しくはこちら <span class="arrow">></span>
              </a>
            </div>
            <div class="card-content">
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.summary }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="news">

      <div class="news-title-container">
        <h2 class="news-title">ニュース</h2>
        <el-icon class="news-icon">
          <Rss />
        </el-icon>
      </div>

      <el-table :data="newsList" style="width: 100%" :header-row-class-name="'hidden-header'" v-loading="isLoadingNews">
        <el-table-column prop="date" label="日付" width="160" />
        <el-table-column prop="category" label="简介" width="120">
          <template #default="scope">
            <span class="category-badge">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="タイトル">
          <template #default="scope">
            <a :href="`/blog/${scope.row.id}`" class="news-item-link">
              {{ scope.row.title }}
              <el-icon v-if="scope.row.type === 'external'">
                <TopRight />
              </el-icon>
              <el-icon v-else>
                <ArrowRight />
              </el-icon>
            </a>
          </template>
        </el-table-column>
      </el-table>

      <div class="news-list-mobile">
        <div class="news-item" v-for="item in newsList" :key="item.title">
          <!-- ✅ 新增容器 -->
          <div class="news-item-header">
            <div class="news-item-date">{{ item.date }}</div>
            <div class="news-item-category">{{ item.category }}</div>
          </div>

          <a :href="`/blog/${item.id}`" class="news-item-link">
            {{ item.title }}
            <el-icon v-if="item.type === 'external'">
              <TopRight />
            </el-icon>
            <el-icon v-else>
              <ArrowRight />
            </el-icon>
          </a>
        </div>
      </div>

      <div class="news-link">
        <a href="#">ニュース一覧 ></a>
      </div>
    </section>

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
// 导入 Element Plus 图标


// script setup lang="ts"
import { ref, onMounted } from 'vue' // 1. 导入 computed
// 2. 导入新图标
import { Search, ArrowRight, TopRight } from "@element-plus/icons-vue";

import { getLatestNews, getPinnedBlogs } from '../http/blogService';


//#region


interface NewsItem {
  id: number; // 新增 id 字段
  date: string;
  category: string;
  title: string;
  type: 'internal' | 'external';
}

const newsList = ref<NewsItem[]>([]); // 存储从 API 获取的新闻
const isLoadingNews = ref(true);      // 加载状态

const formatNewsDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  // 格式化为: 2025年8月27日
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

const activities = ref<any[]>([]); // 存储置顶活动
const isLoadingActivities = ref(true);



// onMounted 会在组件加载时自动运行
onMounted(async () => {
  isLoadingNews.value = true;
  isLoadingActivities.value = true; // 1. 开始加载

  try {
    // (!!!) 2. 并行获取两个接口 (!!!)
    const [newsData, activitiesData] = await Promise.all([
      getLatestNews(1, 10),
      getPinnedBlogs()
    ]);

    // (处理 News... 逻辑不变)
    newsList.value = newsData.map(blog => ({
      id: blog.id, // 确保 id 被传递
      date: formatNewsDate(blog.displayDate),
      category: blog.typeName || '未分类',
      title: blog.title,
      type: 'internal'
    }));

    // (!!!) 3. 处理 Activities (!!!)
    // (DTO 已是扁平结构，可以直接用)
    activities.value = activitiesData;

  } catch (error) {
    console.error("无法加载主页数据:", error);
  } finally {
    isLoadingNews.value = false;
    isLoadingActivities.value = false; // 4. 结束加载
  }
});
//#endregion


const heroItems = [
  { title: "GROUPS", subtitle: "団体の方へ", image: "/images/团体.jpg" },
  { title: "INDIVIDUAL", subtitle: "個人の方へ", image: "/images/个人.jpg" },
  { title: "INFORMATION", subtitle: "団体情報", image: "/images/团体情报.jpg" },
];





</script>

<style scoped>
.home {
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

/* Hero Section */
.hero {
  display: flex;
  width: 100%;
  height: 80vh;
}

.hero-item {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(60%);
  transition: transform 0.5s, filter 0.3s;
}

.hero-item:hover .hero-img {
  transform: scale(1.05);
  filter: brightness(75%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(10px, 3vw, 40px);
  text-align: center;
}

.hero-overlay h2 {
  font-size: clamp(1.6rem, 5vw, 2.8rem);
  font-weight: 700;
  letter-spacing: clamp(0.5px, 0.6vw, 2px);
  line-height: clamp(1.1, 1.3, 1.4);
  text-shadow: 0 clamp(1px, 0.4vw, 2px) clamp(3px, 0.8vw, 5px) rgba(0, 0, 0, 0.6);
}

.hero-overlay p {
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  margin-top: clamp(5px, 1.5vw, 15px);
  font-weight: 500;
  line-height: 1.4;
  text-shadow: 0 clamp(1px, 0.3vw, 2px) clamp(2px, 0.7vw, 4px) rgba(0, 0, 0, 0.6);
}

.hero-overlay p::after {
  content: ' >';
  font-weight: bold;
  margin-left: 0.4em;
  font-size: 1em;
}

/* 纪念图 */
.memorial {
  position: relative;
  margin: 0;
}

.memorial img {
  width: 100%;
  height: auto;
  object-fit: cover;
  filter: brightness(70%);
  vertical-align: bottom;
}

.memorial-text {
  position: absolute;
  color: white;
  top: clamp(45%, 65%, 70%);
  left: clamp(10%, 18vw, 22%);
  font-size: clamp(1.2rem, 5vw, 3.5rem);
  line-height: clamp(1.2, 1.6vw, 1.8);
  font-weight: 400;
  font-family: 'Yu Mincho', 'YuMincho', 'Hiragino Mincho ProN',
    'MS PMincho', 'Noto Serif JP', serif;
  font-style: oblique;
  font-kerning: inherit;
  letter-spacing: clamp(0.5px, 0.6vw, 2px);
  text-shadow: 0 clamp(1px, 0.5vw, 2px) clamp(4px, 1vw, 5px) rgba(0, 0, 0, 0.7);
  transform: translateY(-50%);
}


/* 活动卡片区域 */
/* 活動・プロジェクト整体 */
.cards {
  padding: 80px 10%;
  /* 增加上下内边距 */
  background: #f8f9fb;
}

.cards .section-title {
  text-align: center;
  margin-bottom: 50px;
  /* 增加标题下边距 */
  font-size: 2.2rem;
  /* 增大标题字体 */
  font-weight: 700;
  color: #333;
}

.el-row {
  margin: 0 !important  ;
  
}

.card-wrapper {
  margin-bottom: 40px;
  /* 卡片之间的垂直间距 */
  display: flex;
  /* 让 el-col 内部的 card-item 也能撑满高度 */
}

.card-item {
  width: 100%;
  /* 确保卡片撑满列宽 */
  text-align: left;
  /* 默认左对齐 */
  padding: 20px ;
  /* 移除 el-card 默认 padding */
  border-radius: 8px;
  /* 圆角 */
  overflow: hidden;
  /* 确保图片圆角和按钮位置 */
}

.card-img-container {
  position: relative;
  width: 100%;
  height: 280px;
  /* 调整图片高度，可以根据需求微调 */
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片填充容器并居中 */
  transition: transform 0.3s ease-in-out;
}

.card-item:hover .card-img {
  transform: scale(1.05);
  /* 悬停时图片轻微放大 */
}

.card-content {
  padding: 20px;
  /* 内容区域内边距 */
}

.card-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.card-content p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666;
  min-height: 60px;
  /* 确保描述区域有最小高度 */
}

/* 详细按钮样式 */
.card-button-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  /* 半透明黑色背景 */
  color: white;
  padding: 15px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  /* 按钮文字和箭头左右对齐 */
  align-items: center;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.card-button-overlay:hover {
  background-color: rgba(0, 0, 0, 0.9);
  /* 悬停时背景更深 */
  /* transform: translateY(-5px); */
  /* 可以添加轻微上移效果 */
}

.card-button-overlay .arrow {
  font-weight: bold;
  font-size: 1.1rem;
  /* 箭头更大一点 */
}

/* 新闻区 */
.news-list-mobile {
  display: none;
}

.news {
  padding: 60px 10%;
  background: #fff;
}

.news-title-container {
  position: relative;
  text-align: center;
}

.news-title {
  display: inline-block;
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
}

.news-icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #555;
}

:deep(.hidden-header) {
  display: none;
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

.news-item-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.news-item-link:hover {
  color: #007bff;
}

.news-item-link .el-icon {
  margin-left: 5px;
  vertical-align: middle;
  font-size: 0.9rem;
  color: #888;
}

.news-link {
  margin-top: 30px;
  margin-left: 44px;
  text-align: left;
  font-weight: 600;
}

.news-link a {
  color: #333;
  text-decoration: none;
}

.news-link a:hover {
  color: #007bff;
}

.el-table {
  --el-table-border-color: transparent;
}

:deep(.el-table__row) {
  height: 50px; /* ✅ 默认约 44px，调高行距 */
}

:deep(.el-table__cell) {
  padding: 8px 0;
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
</style>

<style scoped>
@media (max-width: 767px) {
  .el-table {
    display: none;
  }

  .news-list-mobile {
    display: block;
    padding: 0 10%;
  }

  .news-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  /* ✅ 日期 + 分类 同行排列 */
  .news-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .news-item-date {
    font-size: 0.8rem;
    color: #888;
  }

  /* ✅ 分类按钮化 */
  .news-item-category {
    font-size: 0.75rem;
    color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    border: 1px solid #007bff;
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
  }

  .news-item-link {
    width: 100%;
    color: #333;
    text-decoration: none;
    font-weight: 500;
    line-height: 1.5;
  }

  .news-item-link:hover {
    color: #007bff;
  }

  .copyright {
    text-align: center;
    /* ✅ 再次确认文字本身居中 */
    width: 100%;
    /* ✅ 占满父容器宽度以正确居中 */
    font-size: 0.8rem;
    color: #aaa;
    line-height: 1.6;
    margin-top: 10px;
  }

  .copyright p {
    margin: 0;
  }

  .cards {
    padding: 60px 6%; /* 与桌面端 80px 10% 成比例缩小 */
    background: #f8f9fb;
  }

  /* 标题 */
  .cards .section-title {
    text-align: center;
    margin-bottom: 40px; /* 桌面 50px → 稍小 */
    font-size: 1.8rem; /* 桌面 2.2rem → 等比例缩放 */
    font-weight: 700;
    color: #333;
  }

  /* 卡片容器（单列排列） */
  .el-row {
    margin: 0 !important;
    justify-content: center;
  }

  .el-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
  }

  .card-wrapper {
    margin-bottom: 10px; /* 桌面 40px → 轻微缩短 */
    display: flex;
    justify-content: center;
  }

  /* 卡片本体（保持桌面比例，但整体略缩） */
  .card-item {
    width: 95%;
    text-align: left;
    padding: 0px; /* 桌面 20px → 缩小比例 */
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  /* 图片部分：保持高度比例一致 */
  .card-img-container {
    position: relative;
    width: 100%;
    height: 240px; /* 桌面 280px → 比例约 85% */
    overflow: hidden;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
  

  .card-item:hover .card-img {
    transform: scale(1.05);
  }

  :deep(.el-card__body) {
  padding: 20px 20px 0 20px !important;
}

  /* 内容部分：等比例缩放字体 */
  .card-content {
    padding: 10px; /* 桌面 20px */
    padding-top: 0;
  }

  .card-content h3 {
    font-size: 1.15rem; /* 桌面 1.3rem */
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  .card-content p {
    font-size: 0.9rem; /* 桌面 0.95rem */
    line-height: 1.6;
    color: #666;
    min-height: 54px; /* 桌面 60px */
  }

  /* “詳しくはこちら >” 按钮 */
  .card-button-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 12px 18px; /* 桌面 15px 20px */
    font-size: 0.9rem; /* 桌面 0.95rem */
    font-weight: 500;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease-in-out;
  }

  .card-button-overlay:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }

  .card-button-overlay .arrow {
    font-weight: bold;
    font-size: 1rem; /* 桌面 1.1rem */
  }
}
</style>


<style >
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
    /* ✅ 搜索与登录之间用 gap 替代竖线 */
  }

  .nav-icon {
    margin-right: 10px;
  }

  .logo {
    height: 44px;
    margin-top: 4px;
  }

  .hero {
    height: 60vh;
    flex-direction: column;
    margin-top: 161px;
  }

  .hero-item {
    width: 100%;
    flex: none;
  }

  .hero-overlay h2 {
    font-size: clamp(1.2rem, 5vw, 1.8rem);
  }

  .hero-overlay p {
    font-size: clamp(0.9rem, 3.5vw, 1.1rem);
  }

  .cards {
    margin-top: 0px !important;
    margin-bottom: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 20px 0px !important;
  }

  .cards .section-title {
    font-size: 22.4px !important;
    margin-top: 0px !important;
    margin-bottom: 20px !important;
  }

  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    justify-content: center;
  }

  /* 让列在小屏时占满宽度 */
  .el-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  /* 卡片整体宽高比例优化 */
  

  .news {
    padding: 0px !important;
    margin-bottom: 30px !important;
  }

  .news-title {
    font-size: 22.4px !important;
    margin-bottom: 10px !important;
  }



}
</style>
