<template>
    <div>
        CRUD 页面
    </div>
</template>

<script setup lang="ts">
import store from '../store/index' 
console.log('当前用户ID:', store().$state.userId);
</script>