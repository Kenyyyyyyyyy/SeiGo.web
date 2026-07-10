<template>
  <Header v-if="showHeader" />

  <RouterView />

  <Footer v-if="showFooter" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/layout/Header.vue'
import Footer from '@/layout/Footer.vue'
import { defaultSeoForPath, setRobots, setSeo } from '@/utils/seo'

const route = useRoute()
const publicRouteNames = ['home', 'BlogDetail', 'Contact', 'NewsList']

// App.vue
const showHeader = computed(() => {
  // 注意：'BlogDetail' 必须与路由配置中的 name 严格一致
  const activeName = route.name as string
  return publicRouteNames.includes(activeName)
})

const showFooter = computed(() => {
  const activeName = route.name as string
  return publicRouteNames.includes(activeName)
})

watch(
  () => route.fullPath,
  () => {
    const activeName = route.name as string
    const isPublic = publicRouteNames.includes(activeName)
    setRobots(isPublic ? 'index, follow' : 'noindex, nofollow')
    if (isPublic) {
      setSeo(defaultSeoForPath(route.path))
    }
  },
  { immediate: true },
)
</script>




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
