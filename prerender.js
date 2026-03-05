import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, 'dist');

// 需要预渲染的页面路径
const routes = [
  '/',
  '/news-list',
  // 可以根据需要添加更多页面
];

async function prerender() {
  console.log('Starting prerender process...');

  // Vercel 环境配置
  const isVercel = process.env.VERCEL === '1';
  console.log(`Environment: ${isVercel ? 'Vercel' : 'Local'}`);

  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process'
    ],
    // Vercel 环境需要指定可执行路径
    executablePath: isVercel ? process.env.CHROME_PATH : undefined
  });

  try {
    for (const route of routes) {
      console.log(`Prerendering: ${route}`);

      const page = await browser.newPage();

      // 设置视口
      await page.setViewport({ width: 1280, height: 800 });

      // 导航到页面（使用本地服务器）
      const url = `http://localhost:4173${route}`;
      await page.goto(url, { waitUntil: 'networkidle0' });

      // 等待页面完全加载（可以根据需要调整）
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 获取渲染后的 HTML
      const html = await page.content();

      // 确定输出路径
      let outputPath;
      if (route === '/') {
        outputPath = resolve(distDir, 'index.html');
      } else {
        const dirPath = resolve(distDir, route.slice(1));
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }
        outputPath = resolve(dirPath, 'index.html');
      }

      // 写入文件
      writeFileSync(outputPath, html);
      console.log(`Saved: ${outputPath}`);

      await page.close();
    }

    console.log('Prerender completed successfully!');
  } catch (error) {
    console.error('Prerender failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// 检查是否在构建后运行
if (!existsSync(distDir)) {
  console.error('Error: dist directory not found. Please run build first.');
  process.exit(1);
}

prerender();