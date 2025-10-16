<template>
  <header class="app-header">
    <div class="branding">
      <span class="logo" aria-hidden="true">🔐</span>
      <span class="title">Giriş Paneli</span>
    </div>
    <nav class="navigation">
      <RouterLink v-if="isAuthenticated" to="/ana-sayfa">Ana Sayfa</RouterLink>
      <button v-if="isAuthenticated" type="button" class="logout" @click="handleLogout">
        Çıkış Yap
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const auth = useAuth();
const isAuthenticated = computed(() => auth.state.isAuthenticated);

const handleLogout = () => {
  auth.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background-color: #0f172a;
  color: #f8fafc;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
}

.branding {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  font-size: 1.75rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navigation a {
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease-in-out;
}

.navigation a:hover {
  opacity: 0.75;
}

.logout {
  background: transparent;
  border: 1px solid rgba(248, 250, 252, 0.6);
  border-radius: 9999px;
  padding: 0.4rem 1rem;
  color: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.logout:hover {
  background: #f8fafc;
  color: #0f172a;
}
</style>
