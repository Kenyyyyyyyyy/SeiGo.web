import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, 'dist');

// 读取构建后的 index.html
const indexHtmlPath = resolve(distDir, 'index.html');
if (!existsSync(indexHtmlPath)) {
  console.error('Error: index.html not found in dist directory');
  process.exit(1);
}

const originalHtml = readFileSync(indexHtmlPath, 'utf-8');

// 为首页生成静态内容
const homePageStaticContent = `
<!-- 青合クラブ介绍区域 -->
<section class="club-intro" id="club-intro">
  <h1 class="club-intro-title">青合クラブ</h1>
  <div class="club-intro-content">
    <p class="club-intro-subtitle">民間の力で、中日を繋ごう</p>
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

<!-- 活动卡片区域 -->
<section class="cards" id="activities">
  <h2 class="section-title">活動・プロジェクト</h2>
  <div class="el-row" style="margin-left: -20px; margin-right: -20px;">
    <!-- 活动卡片将由 JavaScript 动态加载 -->
  </div>
</section>

<!-- 新闻区域 -->
<section class="news" id="news">
  <div class="news-title-container">
    <h2 class="news-title">ニュース</h2>
    <el-icon class="news-icon"></el-icon>
  </div>

  <div class="el-table--fit el-table--enable-row-hover el-table el-table--layout-fixed is-scrolling-none" data-prefix="el" style="width: 100%;">
    <div class="el-table__inner-wrapper">
      <div class="hidden-columns">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="el-table__header-wrapper">
        <table class="el-table__header" border="0" cellpadding="0" cellspacing="0" style="width: 1024px;">
          <colgroup>
            <col name="el-table_1_column_1" width="160">
            <col name="el-table_1_column_2" width="120">
            <col name="el-table_1_column_3" width="744">
          </colgroup>
          <thead class="">
            <tr class="hidden-header">
              <th class="el-table_1_column_1 is-leaf el-table__cell" colspan="1" rowspan="1">
                <div class="cell">日付</div>
              </th>
              <th class="el-table_1_column_2 is-leaf el-table__cell" colspan="1" rowspan="1">
                <div class="cell">简介</div>
              </th>
              <th class="el-table_1_column_3 is-leaf el-table__cell" colspan="1" rowspan="1">
                <div class="cell">タイトル</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper">
        <div class="el-scrollbar">
          <div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
            <div class="el-scrollbar__view" style="display: inline-block; vertical-align: middle;">
              <table class="el-table__body" cellspacing="0" cellpadding="0" border="0" style="table-layout: fixed; width: 1024px;">
                <colgroup>
                  <col name="el-table_1_column_1" width="160">
                  <col name="el-table_1_column_2" width="120">
                  <col name="el-table_1_column_3" width="744">
                </colgroup>
                <tbody tabindex="-1">
                  <!-- 新闻内容将由 JavaScript 动态加载 -->
                </tbody>
              </table>
              <div class="el-table__empty-block" style="height: 100%; width: 1024px;">
                <span class="el-table__empty-text">ニュースを読み込み中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="news-list-mobile">
    <!-- 移动端新闻列表将由 JavaScript 动态加载 -->
  </div>

  <div class="news-link">
    <a href="/news-list">ニュース一覧 &gt;</a>
  </div>
</section>
`;

// 替换 index.html 中的内容
// 找到 <div id="app"></div> 并替换为包含静态内容
const updatedHtml = originalHtml.replace(
  '<div id="app"></div>',
  `<div id="app"><div class="home">${homePageStaticContent}</div></div>`
);

// 写入更新后的文件
writeFileSync(indexHtmlPath, updatedHtml);
console.log('✅ Static HTML content generated for homepage');

// 为 news-list 页面创建目录和基本文件
const newsListDir = resolve(distDir, 'news-list');
if (!existsSync(newsListDir)) {
  mkdirSync(newsListDir, { recursive: true });
}

const newsListHtml = originalHtml.replace(
  '<div id="app"></div>',
  `<div id="app"><div class="home">
    <section class="news" id="news">
      <div class="news-title-container">
        <h2 class="news-title">ニュース一覧</h2>
        <el-icon class="news-icon"></el-icon>
      </div>
      <div class="news-content">
        <p>ニュース一覧ページ。最新の活動情報やお知らせをご覧いただけます。</p>
        <!-- 新闻列表将由 JavaScript 动态加载 -->
      </div>
    </section>
  </div></div>`
);

writeFileSync(resolve(newsListDir, 'index.html'), newsListHtml);
console.log('✅ Static HTML generated for /news-list page');

console.log('✅ Static HTML generation completed!');