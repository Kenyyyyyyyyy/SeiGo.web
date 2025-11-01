<template>
  <div class="home">
    <header class="navbar">
      <div class="navbar-left">
        <img src="/images/seigou.jpg" alt="Logo" class="logo" />
      </div>
      <nav class="navbar-right">
        <a href="#">団体の方へ &nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
        <a href="#">&nbsp;個人の方へ &nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
        <a href="#">&nbsp;団体情報 &nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
        <a href="#" class="nav-icon">
          <el-icon>
            <Search />
          </el-icon>
        </a>
        <a href="/login" class="global-site">Login</a>
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
    <el-col
      :xs="24"
      :sm="12"
      :md="12" 
      class="card-wrapper"
      v-for="activity in activities" 
      :key="activity.id" 
    >
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
    <el-icon class="news-icon"><Rss /></el-icon>
  </div>

  <el-table
    :data="newsList" 
    style="width: 100%"
    :header-row-class-name="'hidden-header'"
    v-loading="isLoadingNews" 
  >
    <el-table-column prop="date" label="日付" width="160" />
    <el-table-column prop="category" label="简介" width="120">
      <template #default="scope">
        <span class="category-badge">{{ scope.row.category }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="タイトル">
      <template #default="scope">
        <a href="#" class="news-item-link">
          {{ scope.row.title }}
          <el-icon v-if="scope.row.type === 'external'"><TopRight /></el-icon>
          <el-icon v-else><ArrowRight /></el-icon>
        </a>
      </template>
    </el-table-column>
  </el-table>

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

/* --- ① 顶部导航栏 (已修改) --- */
.navbar {
  /* 关键：使用 absolute 布局使其浮动在顶部 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 内边距和透明黑色背景 */
  padding: 15px 5%;
  background-color: rgba(0, 0, 0, 0.4);
  /* 黑色半透明 */
  color: white;
  z-index: 10;
  /* 确保在最上层 */
  box-sizing: border-box;
  /* 避免 padding 影响宽度 */
}

/* 新增：Logo 图片样式 */
.logo {
  height: 70px;
  /* 根据你的 logo 调整 */
  width: auto;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right a {
  color: white;
  margin-left: 20px;
  /* 减小间距 */
  text-decoration: none;
  font-weight: 300;
  /* 字体更细 */
  font-size: 1.2 rem;
  /* 字体更小 */
}

.navbar-right a:hover {
  color: #f4d03f;
}

/* 新增：搜索图标样式 */
.nav-icon {
  font-size: 1.2rem;
  vertical-align: middle;
}

/* 新增：Global Site 样式 (带左侧竖线) */
.global-site {
  border-left: 1px solid #ccc;
  padding-left: 20px;
}

/* --- 结束修改 --- */


/* --- ② Hero Section (已修改) --- */
.hero {
  display: flex;
  width: 100%;
  /* 修改：使用 vh (视口高度) 代替固定 px，使其更高 */
  height: 80vh;
  /* min-height: 500px; */
  /* 可以添加最小高度 */
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
  /* 自动居中并裁剪填充 */
  filter: brightness(60%);
  /* 调暗一点以突出文字 */
  transition: transform 0.5s, filter 0.3s;
}

.hero-item:hover .hero-img {
  transform: scale(1.05);
  /* 悬停时轻微放大 */
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
  padding: 20px;
  text-align: center;
}

/* 新增：Hero 区域文字样式 (带阴影) */
.hero-overlay h2 {
  font-size: 2.5rem;
  /* 调整大小 */
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  /* 添加阴影 */
}

.hero-overlay p {
  font-size: 1.1rem;
  margin-top: 10px;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  /* 添加阴影 */
}

/* 新增：为 subtitle 添加箭头 */
.hero-overlay p::after {
  content: ' >';
  font-weight: bold;
  margin-left: 5px;
}

/* --- 结束修改 --- */


/* ③ 中部图片与标题 */
/* ③ 中部图片与标题 (已修改) */
/* ③ 中部图片与标题 (样式已按新要求修改) */

/* .memorial 和 .memorial img 的样式保持上次修改不变 */
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

/* 重点：替换这个样式 */
.memorial-text {
  position: absolute;
  color: white;

  /* 2. 修改：定位到 "中间偏左" */
  top: 70%;
  left: 20%;
  /* 调整这个百分比来控制 "偏左" 的程度 */
  transform: translateY(-50%);
  /* 配合 top: 50% 实现垂直居中 */

  /* 1. 修改：字体大小更大 */
  font-size: 3.5rem;
  /* 之前是 2.2rem，已大幅增大 */

  /* 3. 修改：使用日式衬线体 (明朝体) */
  font-family: 'Yu Mincho', 'YuMincho', 'Hiragino Mincho ProN', 'MS PMincho', 'Noto Serif JP', serif;
  font-kerning: inherit;
  /* 启用字体字距调整 */
  font-style: oblique;


  line-height: 1.6;
  /* 调整行间距 */
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
}

/* ④ 活动卡片 */
/* ④ 活动卡片 (已修改) */
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
  margin-left: -20px !important;
  /* 调整 el-row 负 margin，适应 gutter */
  margin-right: -20px !important;
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
  padding: 0;
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



/* ⑤ 新闻区 */
/* ⑤ 新闻区 (已修改) */
.news {
  padding: 60px 10%;
  background: #fff;
  /* 移除 text-align: center */
}

/* 新增：标题容器 */
.news-title-container {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
}

.news-title {
  display: inline-block;
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
}

/* 新增：RSS 图标样式 */
.news-icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #555;
}

/* 新增：隐藏表头 (Requirement 1) */
/* 使用 :deep() 来穿透 el-table 的样式 */
:deep(.hidden-header) {
  display: none;
}

/* 新增：类别徽章 (Requirement 2) */
.category-badge {
  background-color: #eee;
  color: #555;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  /* 防止换行 */
}

/* 新增：行链接样式 */
.news-item-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.news-item-link:hover {
  color: #007bff;
  /* 悬停颜色 */
}

.news-item-link .el-icon {
  margin-left: 5px;
  vertical-align: middle;
  font-size: 0.9rem;
  color: #888;
}

/* 修改：新闻列表链接 (Requirement 4) */
.news-link {
  margin-top: 30px;
  margin-left: 20px;
  text-align: left;
  /* 改为左对齐 */
  font-weight: 600;

}

.news-link a {
  color: #333;
  text-decoration: none;
}

.news-link a:hover {
  color: #007bff;
}

/* 移除 el-table 默认的底部边框，使其更干净 */
.el-table {
  --el-table-border-color: transparent;
}

/* 移除 el-table 单元格的内边距，使其更紧凑 */
:deep(.el-table__cell) {
  padding: 8px 0;
}

/* ⑥ 页脚 */
/* ⑥ 页脚 (已修改) */
.footer {
  background: #111;
  color: #ccc;
  /* 匹配其他区域的左右内边距 */
  padding: 40px 10%; 
  /* 移除 text-align: center */
  text-align: left; 
}

/* 上排链接 */
.footer-row-1 {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap; /* 允许换行 */
  gap: 25px; 
}

/* 所有页脚链接的通用样式 */
.footer a {
  color: #ccc;
  text-decoration: none;
  font-size: 0.85rem; /* 字体更小 */
  font-weight: 300; /* 字体更细 */
  transition: color 0.2s;
}
.footer a:hover {
  color: white;
}

/* 分割线 */
.footer-divider {
  border-top: 1px solid #333; /* 分割线颜色 */
  margin: 20px 0; /* 上下间距 */
}

/* 下排容器 */
.footer-row-2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 顶部对齐 */
  flex-wrap: wrap; /* 允许换行 */
  gap: 20px; /* 链接和版权之间的最小间距 */
}

/* 下排左侧链接 */
.footer-links-secondary {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 20px; /* 链接之间的间距 */
}

/* 下排右侧版权 */
.copyright {
  text-align: right;
  font-size: 0.8rem;
  color: #aaa;
  white-space: nowrap; /* 防止版权信息自身换行 */
}
.copyright p {
  margin: 0;
  line-height: 1.4; /* 调整行高 */
}
</style>