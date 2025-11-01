<script setup lang="ts">
</script>

<template>
  <router-view></router-view>
</template>

<style>
html, body {
  /* 解决1：移除所有浏览器默认的白边 */
  margin: 0;
  padding: 0;

  /* 额外修复：防止因边距计算错误导致水平滚动条 */
  width: 100%;
  overflow-x: hidden;
}


/* 解决2：隐藏垂直滚动条的 *样式* */

/* 适用于 Firefox */
body {
  scrollbar-width: none;
}

/* 适用于 IE/Edge (旧版) */
body {
  -ms-overflow-style: none;
}

/* 适用于 WebKit (Chrome, Safari, 新 Edge) */
body::-webkit-scrollbar {
  display: none;
}
</style>