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
  background: linear-gradient(180deg, rgba(241, 245, 249, 0.9) 0%, #ffffff 65%);
}
</style>
