<template>
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

</template>


<style scoped>
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

@media (max-width: 767px) {
  .footer {
    padding: 20px 4% !important;
    text-align: center;
  }
  .footer-row-2 {
    flex-direction: column;
    align-items: flex-start;
  }
  .copyright {
    text-align: left;
  }

}
</style>