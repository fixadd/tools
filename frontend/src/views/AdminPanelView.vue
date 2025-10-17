<template>
  <section class="admin-page" aria-labelledby="admin-panel-title">
    <div class="panel-card">
      <header class="panel-header">
        <div class="panel-heading">
          <span class="panel-badge">Yönetim Modülü</span>
          <h1 id="admin-panel-title">Admin Paneli</h1>
          <p class="panel-intro">
            Rolleri, ürün modüllerini ve entegrasyon bağlantılarını tek noktadan yönetin. Tüm
            güncellemeler ilgili modüllere otomatik olarak aktarılır.
          </p>
        </div>
        <div class="panel-actions">
          <RouterLink :to="primaryActionRoute" class="primary-action">
            {{ primaryActionLabel }}
          </RouterLink>
          <label class="search-field" :class="{ disabled: isSearchDisabled }">
            <span class="search-icon" aria-hidden="true">🔍</span>
            <input
              v-model="searchQuery"
              type="search"
              :disabled="isSearchDisabled"
              :aria-disabled="isSearchDisabled"
              placeholder="Kullanıcı veya ekip ara"
              aria-label="Kullanıcı arama"
              :aria-controls="isSearchDisabled ? undefined : 'users-table'"
            />
          </label>
        </div>
      </header>

      <nav class="panel-tabs" aria-label="Panel içerikleri">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          type="button"
          class="panel-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon" aria-hidden="true">{{ tab.icon }}</span>
          <span class="tab-text">
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-caption">{{ tab.caption }}</span>
          </span>
        </button>
      </nav>

      <div class="panel-body">
        <div v-if="activeTab === 'users'" class="tab-panel users-panel">
          <table id="users-table" class="admin-table">
            <thead>
              <tr>
                <th scope="col">Ad</th>
                <th scope="col">Departman</th>
                <th scope="col">E-posta</th>
                <th scope="col">Son Giriş</th>
                <th scope="col">Modül</th>
              </tr>
            </thead>
            <tbody v-if="filteredUsers.length">
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <span class="user-name">{{ user.name }}</span>
                </td>
                <td>{{ user.department }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.lastLogin }}</td>
                <td>
                  <RouterLink :to="{ name: user.routeName }" class="table-link">
                    {{ user.module }}
                  </RouterLink>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="empty-row">Henüz kullanıcı kaydı bulunmuyor.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="activeTab === 'modules'" class="tab-panel modules-panel">
          <template v-if="moduleCards.length">
            <ul class="module-grid" role="list">
              <li v-for="module in moduleCards" :key="module.id" class="module-card" role="listitem">
                <div class="module-icon" aria-hidden="true">{{ module.icon }}</div>
                <div class="module-text">
                  <p class="module-label">{{ module.title }}</p>
                  <p class="module-meta">{{ module.module }} • {{ module.count }} kayıt</p>
                  <p class="module-note">{{ module.description }}</p>
                </div>
                <RouterLink :to="{ name: module.routeName }" class="module-link">
                  {{ module.linkLabel }}
                </RouterLink>
              </li>
            </ul>
          </template>
          <p v-else class="empty-state">Henüz modül bilgisi eklenmemiş.</p>
        </div>

        <div v-else class="tab-panel integrations-panel">
          <template v-if="integrationCards.length">
            <ul class="integration-grid" role="list">
              <li
                v-for="integration in integrationCards"
                :key="integration.id"
                class="integration-card"
                role="listitem"
              >
                <div class="integration-icon" aria-hidden="true">{{ integration.icon }}</div>
                <div class="integration-text">
                  <p class="integration-label">{{ integration.title }}</p>
                  <p class="integration-status">{{ integration.status }}</p>
                  <p class="integration-note">{{ integration.note }}</p>
                </div>
                <RouterLink :to="{ name: integration.routeName }" class="integration-link">
                  {{ integration.linkLabel }}
                </RouterLink>
              </li>
            </ul>
          </template>
          <p v-else class="empty-state">Henüz entegrasyon bağlantısı eklenmemiş.</p>
        </div>
      </div>
    </div>

    <article class="workflow-card">
      <header>
        <h2>Yönetim Döngüsü</h2>
        <p>
          Modüller arası entegrasyonlar otomatik aktarılır. Güncellemeler anlık olarak tüm ekiplere
          yansır.
        </p>
      </header>
      <ol class="workflow-steps">
        <li>
          Rol atamaları tamamlandığında detaylar
          <RouterLink :to="{ name: 'profile' }">Profil</RouterLink> ekranında görüntülenir ve
          ilgili bildirimler gönderilir.
        </li>
        <li>
          Ürün kataloglarında yapılan değişiklikler
          <RouterLink :to="{ name: 'request-tracking' }">Talep Takip</RouterLink> ve
          <RouterLink :to="{ name: 'inventory-tracking' }">Envanter Takip</RouterLink>
          formlarına otomatik olarak yansır.
        </li>
        <li>
          LDAP ve SSO entegrasyon güncellemeleri anlık olarak
          <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> modülüne loglanır ve
          <RouterLink :to="{ name: 'knowledge-base' }">Bilgi Bankası</RouterLink> rehberlerinde
          yayınlanır.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

type RouteName =
  | 'home'
  | 'inventory-tracking'
  | 'request-tracking'
  | 'printer-tracking'
  | 'license-tracking'
  | 'admin-panel'
  | 'profile'
  | 'knowledge-base'
  | 'records'
  | 'scrap-management';

type TabId = 'users' | 'modules' | 'integrations';

interface TabItem {
  id: TabId;
  label: string;
  caption: string;
  icon: string;
}

interface UserRow {
  id: string;
  name: string;
  department: string;
  email: string;
  lastLogin: string;
  module: string;
  routeName: RouteName;
}

interface ModuleCard {
  id: string;
  title: string;
  module: string;
  count: number;
  description: string;
  routeName: RouteName;
  icon: string;
  linkLabel: string;
}

interface IntegrationCard {
  id: string;
  title: string;
  status: string;
  note: string;
  routeName: RouteName;
  icon: string;
  linkLabel: string;
}

const tabItems: TabItem[] = [
  {
    id: 'users',
    label: 'Kullanıcı Yönetimi',
    caption: 'Roller ve ekipler',
    icon: '👥'
  },
  {
    id: 'modules',
    label: 'Ürün Modülleri',
    caption: 'Katalog ve stoklar',
    icon: '🧩'
  },
  {
    id: 'integrations',
    label: 'Bağlantılar',
    caption: 'LDAP & API ayarları',
    icon: '🔗'
  }
];

const activeTab = ref<TabId>('users');
const searchQuery = ref('');

const userRows: UserRow[] = [];

const moduleCards: ModuleCard[] = [];

const integrationCards: IntegrationCard[] = [];

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return userRows;
  }

  return userRows.filter((user) => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.module.toLowerCase().includes(query)
    );
  });
});

const isSearchDisabled = computed(() => activeTab.value !== 'users');

watch(activeTab, (tab) => {
  if (tab !== 'users') {
    searchQuery.value = '';
  }
});

const primaryActionLabel = computed(() => {
  switch (activeTab.value) {
    case 'modules':
      return 'Katalogu Güncelle';
    case 'integrations':
      return 'Bağlantı Ekle';
    default:
      return 'Yeni Kullanıcı';
  }
});

const primaryActionRoute = computed<RouteLocationRaw>(() => {
  switch (activeTab.value) {
    case 'modules':
      return { name: 'inventory-tracking' };
    case 'integrations':
      return { name: 'knowledge-base' };
    default:
      return { name: 'profile' };
  }
});
</script>

<style scoped>
.admin-page {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.panel-card {
  background: #ffffff;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 32px 70px rgba(15, 23, 42, 0.12);
  padding: 2.5rem;
  display: grid;
  gap: 2rem;
}

.panel-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.75rem;
}

.panel-heading {
  display: grid;
  gap: 0.85rem;
  max-width: 580px;
}

.panel-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-weight: 700;
}

.panel-heading h1 {
  margin: 0;
  font-size: 2.3rem;
}

.panel-intro {
  margin: 0;
  font-size: 1.02rem;
  color: #475569;
  line-height: 1.6;
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.65rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f8fafc;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 20px 36px rgba(37, 99, 235, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 44px rgba(37, 99, 235, 0.32);
}

.search-field {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 1rem;
  border-radius: 16px;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.search-field input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #0f172a;
  min-width: 220px;
}

.search-field input::placeholder {
  color: rgba(100, 116, 139, 0.8);
}

.search-field.disabled {
  opacity: 0.6;
}

.search-field.disabled input {
  cursor: not-allowed;
}

.search-icon {
  font-size: 1.1rem;
}

.panel-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.panel-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(248, 250, 252, 0.9);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.panel-tab:hover {
  transform: translateY(-2px);
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 16px 28px rgba(37, 99, 235, 0.18);
}

.panel-tab.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(37, 99, 235, 0.12));
  border-color: rgba(37, 99, 235, 0.45);
  box-shadow: 0 20px 36px rgba(37, 99, 235, 0.22);
}

.tab-icon {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 16px;
  background: rgba(59, 130, 246, 0.18);
  display: grid;
  place-items: center;
  font-size: 1.25rem;
}

.tab-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}

.tab-label {
  font-weight: 600;
}

.tab-caption {
  font-size: 0.82rem;
  color: #475569;
}

.panel-body {
  display: block;
}

.tab-panel {
  background: rgba(248, 250, 252, 0.9);
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 1.5rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 22px 38px rgba(15, 23, 42, 0.08);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.admin-table th,
.admin-table td {
  padding: 0.9rem 1.1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.empty-row {
  text-align: center;
  padding: 2rem 0;
  color: #64748b;
  font-weight: 500;
  background: rgba(241, 245, 249, 0.6);
}

.admin-table thead th {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
  background: rgba(226, 232, 240, 0.4);
}

.user-name {
  font-weight: 600;
}

.table-link {
  color: #2563eb;
  font-weight: 600;
}

.module-grid,
.integration-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.2rem;
}

.module-card,
.integration-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.4rem 1.6rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
}

.module-icon,
.integration-icon {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 18px;
  background: rgba(59, 130, 246, 0.16);
  display: grid;
  place-items: center;
  font-size: 1.35rem;
}

.module-label,
.integration-label {
  margin: 0;
  font-weight: 600;
  font-size: 1.05rem;
}

.module-meta,
.integration-status {
  margin: 0.25rem 0 0;
  color: #475569;
  font-size: 0.9rem;
}

.module-note,
.integration-note {
  margin: 0.45rem 0 0;
  color: #1f2937;
  font-size: 0.92rem;
  line-height: 1.5;
}

.module-link,
.integration-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
}

.empty-state {
  margin: 0;
  padding: 2.25rem;
  text-align: center;
  border-radius: 20px;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  color: #475569;
  background: rgba(248, 250, 252, 0.9);
  font-weight: 500;
}

.workflow-card {
  background: #ffffff;
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 2.25rem;
  box-shadow: 0 28px 52px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1.5rem;
}

.workflow-card header h2 {
  margin: 0 0 0.6rem;
  font-size: 1.6rem;
}

.workflow-card header p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.workflow-steps {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 1rem;
  color: #1f2937;
  line-height: 1.6;
}

.workflow-steps a {
  color: #2563eb;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .panel-card {
    padding: 2rem;
  }

  .panel-tabs {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .module-card,
  .integration-card {
    grid-template-columns: 1fr;
    text-align: left;
  }
}

@media (max-width: 720px) {
  .panel-header {
    flex-direction: column;
  }

  .panel-actions {
    width: 100%;
    justify-content: space-between;
  }

  .search-field input {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 560px) {
  .panel-card {
    padding: 1.6rem;
  }

  .panel-tabs {
    grid-template-columns: 1fr;
  }

  .panel-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-action,
  .search-field {
    width: 100%;
  }

  .search-field {
    justify-content: flex-start;
  }
}
</style>
