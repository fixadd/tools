<template>
  <header class="app-header">
    <div class="header-titles">
      <span class="eyebrow">Envanter Kontrol</span>
      <h1>{{ pageTitle }}</h1>
    </div>
    <div class="header-actions">
      <span class="user-chip" aria-label="Aktif kullanıcı">
        <span class="avatar" aria-hidden="true">A</span>
        <span class="username">admin</span>
      </span>
      <button type="button" class="logout" @click="handleLogout">
        Çıkış Yap
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const auth = useAuth();

const pageTitle = computed(() => {
  const title = route.meta?.title;
  return typeof title === 'string' && title.length > 0 ? title : 'Kontrol Paneli';
});

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
  padding: 1.5rem 3rem 1.5rem 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.header-titles {
  display: grid;
  gap: 0.25rem;
}

.eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #64748b;
}

h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #0f172a;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem 0.4rem 0.5rem;
  border-radius: 9999px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-weight: 600;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: #f8fafc;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.logout {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  color: #f8fafc;
  padding: 0.65rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 20px rgba(37, 99, 235, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logout:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.3);
}

.logout:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 1.25rem 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
