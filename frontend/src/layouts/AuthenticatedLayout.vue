<template>
  <div class="layout">
    <aside class="sidebar" aria-label="Ana navigasyon">
      <div class="sidebar-inner">
        <header class="sidebar-header">
          <h1 class="sidebar-title">BT Yönetim Portalı</h1>
          <p class="sidebar-description">
            Tüm modüllere tek noktadan erişin ve sayfalar arası geçişleri buradan başlatın.
          </p>
        </header>

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
              <span v-if="item.icon" class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <div class="nav-text">
                <span class="nav-label">{{ item.label }}</span>
                <span v-if="item.caption" class="nav-caption">{{ item.caption }}</span>
              </div>
            </RouterLink>

            <hr v-if="index !== navGroups.length - 1" class="group-divider" />
          </section>
        </nav>
      </div>
    </aside>

    <div class="layout-main">
      <AppHeader />
      <div class="layout-content">
        <div class="content-container">
          <RouterView />
        </div>
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
  icon?: string;
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
      {
        name: 'home',
        label: 'Ana Sayfa',
        caption: 'Genel bakış ve özet',
        icon: '🏠'
      }
    ]
  },
  {
    id: 'tracking',
    label: 'Takip Modülleri',
    items: [
      {
        name: 'inventory-tracking',
        label: 'Envanter Takip',
        caption: 'Donanım varlıkları',
        icon: '📦'
      },
      {
        name: 'license-tracking',
        label: 'Lisans Takip',
        caption: 'Yazılım yetkileri',
        icon: '🪪'
      },
      {
        name: 'printer-tracking',
        label: 'Yazıcı Takip',
        caption: 'Yazıcı durumları',
        icon: '🖨️'
      },
      {
        name: 'stock-tracking',
        label: 'Stok Takip',
        caption: 'Giriş / çıkış işlemleri',
        icon: '📊'
      }
    ]
  },
  {
    id: 'operations',
    label: 'Operasyon',
    items: [
      {
        name: 'request-tracking',
        label: 'Talep Takip',
        caption: 'Açık talepler',
        icon: '🗂️'
      },
      {
        name: 'knowledge-base',
        label: 'Bilgi Bankası',
        caption: 'Prosedürler ve rehberler',
        icon: '📚'
      },
      {
        name: 'scrap-management',
        label: 'Hurdalar',
        caption: 'Hurda listesi',
        icon: '🗑️'
      }
    ]
  },
  {
    id: 'account',
    label: 'Hesap ve Yönetim',
    items: [
      {
        name: 'profile',
        label: 'Profil',
        caption: 'Kullanıcı bilgileri',
        icon: '👤'
      },
      {
        name: 'admin-panel',
        label: 'Admin Paneli',
        caption: 'Yetki ve roller',
        icon: '🛠️'
      },
      {
        name: 'records',
        label: 'Kayıtlar',
        caption: 'İşlem geçmişi',
        icon: '📝'
      }
    ]
  }
]);
</script>

<style scoped>
.layout {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
}

.sidebar {
  background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 16px 0 40px rgba(15, 23, 42, 0.05);
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 2.5rem 1.75rem 2rem;
  height: 100%;
}

.sidebar-header {
  display: grid;
  gap: 0.45rem;
}

.sidebar-title {
  margin: 0;
  font-size: 1.35rem;
  color: #0f172a;
}

.sidebar-description {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.5;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  flex: 1;
}

.nav-group {
  display: grid;
  gap: 0.6rem;
}

.group-label {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.55);
}

.nav-link {
  display: flex;
  gap: 0.85rem;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  text-decoration: none;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.nav-link:hover {
  transform: translateX(6px);
  box-shadow: 0 14px 26px rgba(37, 99, 235, 0.15);
  border-color: rgba(59, 130, 246, 0.35);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(37, 99, 235, 0.8));
  color: #f8fafc;
  border-color: rgba(191, 219, 254, 0.75);
  box-shadow: 0 18px 32px rgba(37, 99, 235, 0.25);
}

.nav-link.active .nav-caption {
  color: rgba(248, 250, 252, 0.85);
}

.nav-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.16);
  display: grid;
  place-items: center;
  font-size: 1.15rem;
}

.nav-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.nav-caption {
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.55);
}

.group-divider {
  margin: 1.25rem 0 0;
  border: none;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.layout-main {
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top left, rgba(191, 219, 254, 0.3), transparent 55%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, #f8fbff 60%, #eef2ff 100%);
}

.layout-content {
  flex: 1;
  padding: 2.5rem 3rem 3rem;
  overflow-y: auto;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

@media (max-width: 1200px) {
  .layout {
    grid-template-columns: 260px 1fr;
  }
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    overflow-x: auto;
  }

  .sidebar-inner {
    flex-direction: row;
    align-items: stretch;
    gap: 1.5rem;
  }

  .sidebar-header {
    min-width: 240px;
    flex: 0 0 auto;
  }

  .sidebar-nav {
    flex: 1;
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

@media (max-width: 640px) {
  .layout-content {
    padding: 1.75rem 1.5rem 2rem;
  }

  .content-container {
    gap: 2rem;
  }
}
</style>
