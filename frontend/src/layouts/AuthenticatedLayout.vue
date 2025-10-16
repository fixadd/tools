<template>
  <div class="layout">
    <aside class="sidebar" aria-label="Ana navigasyon">
      <div class="sidebar-brand">
        <span class="brand-icon" aria-hidden="true">📦</span>
        <div>
          <p class="brand-eyebrow">Envanter Yönetimi</p>
          <h1>Kontrol Paneli</h1>
        </div>
      </div>

      <nav class="sidebar-nav">
        <section
          v-for="(group, index) in navGroups"
          :key="group.id"
          class="nav-group"
        >
          <p v-if="group.label" class="group-label">{{ group.label }}</p>
          <RouterLink
            v-for="item in group.items"
            :key="item.name"
            :to="{ name: item.name }"
            class="nav-link"
            :class="{ active: activeRouteName === item.name }"
          >
            <span class="nav-label">{{ item.label }}</span>
            <span v-if="item.caption" class="nav-caption">{{ item.caption }}</span>
          </RouterLink>

          <hr v-if="index !== navGroups.length - 1" class="group-divider" />
        </section>
      </nav>
    </aside>

    <div class="layout-main">
      <AppHeader />
      <div class="layout-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';

const route = useRoute();
const activeRouteName = computed(() => (route.name ?? '').toString());

interface NavItem {
  name: string;
  label: string;
  caption?: string;
}

interface NavGroup {
  id: string;
  label?: string;
  items: NavItem[];
}

const navGroups = computed<NavGroup[]>(() => [
  {
    id: 'overview',
    items: [
      { name: 'home', label: 'Ana Sayfa', caption: 'Genel bakış ve özet' }
    ]
  },
  {
    id: 'tracking',
    label: 'Takip Modülleri',
    items: [
      { name: 'inventory-tracking', label: 'Envanter Takip', caption: 'Donanım varlıkları' },
      { name: 'license-tracking', label: 'Lisans Takip', caption: 'Yazılım yetkileri' },
      { name: 'printer-tracking', label: 'Yazıcı Takip', caption: 'Yazıcı durumları' },
      { name: 'stock-tracking', label: 'Stok Takip', caption: 'Giriş / çıkış işlemleri' }
    ]
  },
  {
    id: 'operations',
    label: 'Operasyon',
    items: [
      { name: 'request-tracking', label: 'Talep Takip', caption: 'Açık talepler' },
      { name: 'knowledge-base', label: 'Bilgi Bankası', caption: 'Prosedürler ve rehberler' },
      { name: 'scrap-management', label: 'Hurdalar', caption: 'Hurda listesi' }
    ]
  },
  {
    id: 'account',
    label: 'Hesap ve Yönetim',
    items: [
      { name: 'profile', label: 'Profil', caption: 'Kullanıcı bilgileri' },
      { name: 'admin-panel', label: 'Admin Paneli', caption: 'Yetki ve roller' },
      { name: 'records', label: 'Kayıtlar', caption: 'İşlem geçmişi' }
    ]
  }
]);
</script>

<style scoped>
.layout {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  padding: 2.5rem 2rem;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.95), #0f172a 65%);
  color: #e2e8f0;
  box-shadow: inset -1px 0 0 rgba(148, 163, 184, 0.25);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.sidebar-brand h1 {
  font-size: 1.25rem;
  margin: 0;
}

.brand-icon {
  font-size: 2rem;
}

.brand-eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin: 0;
  color: rgba(226, 232, 240, 0.7);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  flex: 1;
}

.nav-group {
  display: grid;
  gap: 0.5rem;
}

.group-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(226, 232, 240, 0.6);
  margin: 0 0 0.75rem;
}

.nav-link {
  display: grid;
  gap: 0.2rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  background: rgba(15, 23, 42, 0.35);
  border: 1px solid rgba(148, 163, 184, 0.2);
  transition: background 0.2s ease, border 0.2s ease, transform 0.2s ease;
}

.nav-link:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(148, 163, 184, 0.35);
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.85), rgba(30, 64, 175, 0.85));
  border-color: rgba(191, 219, 254, 0.6);
  color: #f8fafc;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
}

.nav-label {
  font-weight: 600;
  font-size: 0.98rem;
}

.nav-caption {
  font-size: 0.78rem;
  color: rgba(226, 232, 240, 0.75);
}

.group-divider {
  border: none;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  margin: 1.25rem 0 0;
}

.layout-main {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, #f8fafc 55%, #e2e8f0 100%);
}

.layout-content {
  flex: 1;
  padding: 2.5rem 3rem 3rem;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 240px 1fr;
  }
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 2;
    flex-direction: row;
    overflow-x: auto;
    padding: 1.5rem 1.25rem;
    gap: 1.25rem;
  }

  .sidebar-brand {
    margin: 0;
    flex: 0 0 auto;
  }

  .sidebar-nav {
    flex-direction: row;
    gap: 1rem;
  }

  .nav-group {
    min-width: 220px;
  }

  .group-divider {
    display: none;
  }
}
</style>
