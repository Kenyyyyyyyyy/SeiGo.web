<template>
  <div class="home">

    <section class="club-intro" id="club-intro">
      <h1 class="club-intro-title">青合クラブ</h1>

        <div class="club-intro-content">

          <p class="club-intro-subtitle"> 
            民間の力で、中日を繋ごう
          </p>

          <p class="club-intro-text">
            2023年、青合クラブは、日本と中国の青年有志によって設立されました<br>
            現在では、その活動の輪は<b>関東</b>・<b>関西</b>・<b>中部</b>地域へと着実に広がっています
          </p>

          <p class="club-intro-text">
            私たちは、変動の激しい時代だからこそ、若い世代が歴史の記憶を正面から受け止め<br>
            次の時代へと継承していくことが重要であると考えています<br>
            草の根の交流を通じて社会に貢献し、日中友好の基盤となる「民間の絆」を育み、より確かなものにしていくこと<br>
            それが私たちの目的です
          </p>

          <p class="club-intro-text">
            過去に真摯に向き合い、平和な未来を共に構想し、行動しようとする若者たちが集う場<br>
            それが青合クラブです
          </p>

          <p class="club-intro-text">
            日本の若い世代との交流を希望される個人の方々<br>
            また日中間における歴史的公正の追求や民間交流の促進に取り組まれている団体・組織の皆様との連携を<br>
            私たちは大切にしています。活動にご関心をお持ちの方は<br>
            どうぞお気軽にお問い合わせください
          </p>
        </div>
      </section>  

    <section class="cards" id="activities">
      <h2 class="section-title">活動・プロジェクト</h2>

      <el-row :gutter="40" v-loading="isLoadingActivities">
        <el-col :xs="24" :sm="12" :md="12" class="card-wrapper" v-for="activity in activities" :key="activity.id">
          <el-card class="card-item" shadow="hover">
            <div class="card-img-container">
              <img :src="activity.coverImageUrl" class="card-img" />

              <router-link :to="`/blog/${activity.id}`" class="card-button-overlay">
                詳しくはこちら >
              </router-link>

            </div>
            <div class="card-content">
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.summary }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="news" id="news">

      <div class="news-title-container">
        <h2 class="news-title">ニュース</h2>
        <el-icon class="news-icon">
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
        <router-link to="/news-list">ニュース一覧 ></router-link>
      </div>
    </section>

    
  </div>
</template>

------------------------------------------------------------------

<script setup lang="ts">
// 导入 Element Plus 图标


// script setup lang="ts"
import { ref, onMounted } from 'vue' // 1. 导入 computed
// 2. 导入新图标
import { ArrowRight, TopRight } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'; // 导入 ElMessage

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

const NAVBAR_HEIGHT = 72; // 与你的 navbar 实际高度一致

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y =
    el.getBoundingClientRect().top +
    window.pageYOffset -
    NAVBAR_HEIGHT;

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
};


// onMounted 会在组件加载时自动运行
onMounted(async () => {
  // 1. 显示日语提示消息 (10s 后消失)
  // ElMessage({
  //   message: 'ご訪問ありがとうございます。トラフィック制限により、データが表示されない場合があります。現在バックエンドシステムを起動中です。5-10秒ほどお待ちください。',
  //   type: 'warning',
  //   duration: 5000, // 10 秒
  //   showClose: false,
  //   offset: 110, // 设置偏移量，使其出现在导航栏下方
  // });

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


</script>

<style scoped>
/* ===== 基础样式 ===== */
.home {
  font-family: 'Noto Sans JP', sans-serif;
  color: #333;
  padding-top: 20px;
}

/* ===== 青合クラブ介绍区域 ===== */
.club-intro {
  max-width: 1200px;
  margin: 0 auto 100px;
  padding: 0 20px;
}

.club-intro-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
}

.club-intro-subtitle {
  text-align: center;
  color: #999;
  font-size: 1.3rem;
  font-style: italic;
  margin-bottom: 30px;
  letter-spacing: 0.08em;
}

.club-intro-content {
  max-width: 1000px;
  margin: 0 auto;
}

.club-intro-text {
  font-size: 1.05rem;
  line-height: 1.9;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
}

/* ===== 活动卡片区域 ===== */
.cards {
  padding: 40px 10%;
  background: #f8f9fb;
}

.cards .section-title {
  text-align: center;
  margin-bottom: 50px;
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
}

.el-row {
  margin: 0 !important;
}

.card-wrapper {
  margin-bottom: 40px;
  display: flex;
}

.card-item {
  width: 100%;
  text-align: left;
  padding: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.card-img-container {
  position: relative;
  width: 100%;
  height: 280px;
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

.card-content {
  padding: 20px;
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
}

/* 详细按钮样式 */
.card-button-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 20px;
  font-size: 0.95rem;
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
  font-size: 1.1rem;
}

/* ===== 新闻区域 ===== */
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

/* 桌面端新闻表格 */
.news-list-mobile {
  display: none;
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

/* Element Plus 表格样式 */
.el-table {
  --el-table-border-color: transparent;
}

:deep(.el-table__row) {
  height: 50px;
}

:deep(.el-table__cell) {
  padding: 8px 0;
}

/* ===== 移动端响应式样式 ===== */
@media (max-width: 767px) {
  .home {
    padding-top: 0;
  }

  /* 新闻区域移动端适配 */
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

  /* 活动卡片区域移动端适配 */
  .cards {
    padding: 60px 6%;
    background: #f8f9fb;
  }

  .cards .section-title {
    text-align: center;
    margin-bottom: 40px;
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }

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
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }

  .card-item {
    width: 95%;
    text-align: left;
    padding: 0;
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

  .card-img-container {
    position: relative;
    width: 100%;
    height: 240px;
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

  .card-content {
    padding: 10px;
    padding-top: 0;
  }

  .card-content h3 {
    font-size: 1.15rem;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  .card-content p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #666;
    min-height: 54px;
  }

  .card-button-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 12px 18px;
    font-size: 0.9rem;
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
    font-size: 1rem;
  }

  /* 新闻标题移动端适配 */
  .news {
    padding: 0 !important;
    margin-bottom: 30px !important;
  }

  .news-title {
    font-size: 22.4px !important;
    margin-bottom: 10px !important;
  }

}
</style>
