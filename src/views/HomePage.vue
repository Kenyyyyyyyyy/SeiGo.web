<template>
  <div class="home">

    <!-- ① 顶部导航栏 -->
    <header class="navbar">
      <div class="navbar-left">
        <h1 class="logo">TOKYO SEIGO CLUB</h1>
      </div>
      <nav class="navbar-right">
        <a href="#">団体の方へ</a>
        <a href="#">個人の方へ</a>
        <a href="#">団体情報</a>
        <a href="#">ニュース</a>
        <a href="#">お問い合わせ</a>
      </nav>
    </header>

    <!-- ② 顶部横幅：三块图 -->
    <section class="hero">
      <div class="hero-item" v-for="(item, index) in heroItems" :key="index">
        <img :src="item.image" class="hero-img" />
        <div class="hero-overlay">
          <h2>{{ item.title }}</h2>
          <p>{{ item.subtitle }}</p>
        </div>
      </div>
    </section>

    <!-- ③ 中部图片与标题 -->
    <section class="memorial">
      <img src="/images/memorial.jpg" alt="memorial" />
      <div class="memorial-text">
        <h2>2025 花岡平和記念</h2>
      </div>
    </section>

    <!-- ④ 活动卡片 -->
    <section class="cards">
      <h2 class="section-title">活動・プロジェクト</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="(card, index) in cards" :key="index">
          <el-card class="card-item" shadow="hover">
            <img :src="card.image" class="card-img" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.desc }}</p>
            <el-button type="primary" link>詳しくはこちら ></el-button>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- ⑤ 新闻列表 -->
    <section class="news">
      <h2>ニュース</h2>
      <el-table :data="news" stripe border style="width: 100%">
        <el-table-column prop="date" label="日付" width="160" />
        <el-table-column prop="title" label="タイトル" />
      </el-table>
      <div class="news-link">
        <a href="#">ニュース一覧 ></a>
      </div>
    </section>

    <!-- ⑥ 页脚 -->
    <footer class="footer">
      <div class="footer-links">
        <a href="#">ニュース</a>
        <a href="#">サイト情報</a>
        <a href="#">SNSアカウント</a>
        <a href="#">お問い合わせ</a>
      </div>
      <p>© 2025 TOKYO SEIGO CLUB</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const heroItems = [
  { title: "GROUPS", subtitle: "団体の方へ", image: "/images/tuanti.jpg" },
  { title: "INDIVIDUAL", subtitle: "個人の方へ", image: "/images/geren.webp" },
  { title: "INFORMATION", subtitle: "団体情報", image: "/images/tuantiqingbao.webp" },
];

const cards = [
  {
    title: "Vision 2030 magazine",
    desc: "人生と戦争の問題を考える学生たちのプロジェクト。",
    image: "/images/card1.jpg",
  },
  {
    title: "動画 | Vision2030",
    desc: "特別対談：平和を次世代へ。",
    image: "/images/card2.jpg",
  },
  {
    title: "ニコンのサステナビリティ",
    desc: "技術と平和の未来を考える。",
    image: "/images/card3.jpg",
  },
];

const news = [
  { date: "2025年8月27日", title: "「フラッシュバック」上映イベントのご案内" },
  { date: "2025年8月22日", title: "記念事業に関するお知らせ" },
  { date: "2025年8月12日", title: "学生参加募集について" },
];
</script>

<style scoped>
.home {
  font-family: 'Noto Sans JP', sans-serif;
  color: #333;
}

/* ① 顶部导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5%;
  background-color: #111;
  color: white;
}

.navbar-right a {
  color: white;
  margin-left: 25px;
  text-decoration: none;
  font-weight: 500;
}

.navbar-right a:hover {
  color: #f4d03f;
}

/* ② Hero Section */
.hero {
  display: flex;
  width: 100%;
  height: 400px;
}

.hero-item {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
  transition: transform 0.5s;
}

.hero-item:hover .hero-img {
  transform: scale(1.1);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ③ 中部图片与标题 */
.memorial {
  position: relative;
  text-align: center;
  margin: 40px 0;
}

.memorial img {
  width: 100%;
  height: auto;
  filter: brightness(80%);
}

.memorial-text {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 2rem;
}

/* ④ 活动卡片 */
.cards {
  padding: 40px 10%;
  background: #f8f9fb;
}

.cards .section-title {
  text-align: center;
  margin-bottom: 30px;
}

.card-item {
  text-align: center;
}

.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  margin-bottom: 10px;
}

/* ⑤ 新闻区 */
.news {
  padding: 40px 10%;
  background: #fff;
  text-align: center;
}

.news h2 {
  margin-bottom: 20px;
}

.news-link {
  margin-top: 20px;
  text-align: right;
}

/* ⑥ 页脚 */
.footer {
  background: #111;
  color: #ccc;
  padding: 40px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
}

.footer-links a:hover {
  color: white;
}
</style>