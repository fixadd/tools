<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(165deg, #e8f1ff 0%, #f4f8ff 55%, #ffffff 100%);
}
</style>
