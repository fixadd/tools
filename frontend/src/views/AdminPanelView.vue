<template>
  <section class="admin-layout" aria-labelledby="admin-panel-heading">
    <aside class="side-nav" aria-label="Uygulama menüsü">
      <div v-for="group in navGroups" :key="group.title" class="nav-group">
        <p class="nav-title">{{ group.title }}</p>
        <RouterLink
          v-for="item in group.items"
          :key="item.route"
          :to="{ name: item.route }"
          class="nav-link"
          :class="{ active: item.route === 'admin-panel' }"
        >
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </aside>

    <main class="panel-area">
      <header class="page-hero">
        <div class="hero-copy">
          <span class="hero-badge">Ayarlar</span>
          <h1 id="admin-panel-heading">Admin Paneli</h1>
          <p>
            Kullanıcı yetkilerini, ürün kataloglarını ve LDAP bağlantılarını tek merkezden yöneterek
            tüm modüllere eş zamanlı güncellemeler aktarın.
          </p>
        </div>
        <div class="hero-stat">
          <p class="stat-label">Aktif Kullanıcı</p>
          <p class="stat-value">{{ activeUserCount }}</p>
          <RouterLink :to="{ name: 'profile' }" class="stat-link">Profil detayına git</RouterLink>
        </div>
      </header>

      <section class="panel-card" :aria-labelledby="`tab-${activeTab}`">
        <header class="panel-header">
          <nav class="tab-list" aria-label="Panel sekmeleri">
            <button
              v-for="tab in tabItems"
              :key="tab.id"
              type="button"
              class="tab-button"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <span>{{ tab.label }}</span>
              <span class="tab-caption">{{ tab.caption }}</span>
            </button>
          </nav>
          <div class="panel-toolbar">
            <label class="search-field" :class="{ disabled: isSearchDisabled }">
              <span class="search-icon" aria-hidden="true">🔍</span>
              <input
                v-model="searchQuery"
                type="search"
                :disabled="isSearchDisabled"
                :aria-disabled="isSearchDisabled"
                placeholder="Ara..."
                aria-label="Kullanıcı ara"
              />
            </label>
            <button type="button" class="toolbar-button" @click="handleToolbarAction">
              {{ toolbarButtonLabel }}
            </button>
          </div>
        </header>

        <div class="panel-body">
          <div v-if="activeTab === 'users'" class="users-tab" role="region" aria-live="polite">
            <header class="tab-copy">
              <h2 id="tab-users">Kullanıcı Yönetimi</h2>
              <p>Rolleri, ekip atamalarını ve modül izinlerini güncelleyin.</p>
            </header>
            <div class="table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Kullanıcı Adı</th>
                    <th scope="col">Ad Soyad</th>
                    <th scope="col">E-posta</th>
                    <th scope="col">Rol</th>
                    <th scope="col" class="actions">İşlemler</th>
                  </tr>
                </thead>
                <tbody v-if="filteredUsers.length">
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td data-title="No">{{ user.order }}</td>
                    <td data-title="Kullanıcı Adı">{{ user.username }}</td>
                    <td data-title="Ad Soyad">{{ user.fullName }}</td>
                    <td data-title="E-posta">{{ user.email }}</td>
                    <td data-title="Rol">{{ user.role }}</td>
                    <td data-title="İşlemler" class="actions">
                      <button type="button" class="link-button" @click="goToProfile(user.routeName)">
                        Düzenle
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="6" class="empty-state">Kayıt bulunamadı.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else-if="activeTab === 'product'" class="product-tab" role="region">
            <header class="tab-copy">
              <h2 id="tab-product">Ürün / Envanter Ekle</h2>
              <p>Yeni lisans ya da donanım girişlerini ilgili alanlarla kaydedin.</p>
            </header>
            <form class="product-form" @submit.prevent="handleToolbarAction">
              <div v-for="field in productFields" :key="field.id" class="form-field">
                <label :for="field.id">{{ field.label }}</label>
                <input :id="field.id" :placeholder="field.placeholder" type="text" />
              </div>
            </form>
          </div>

          <div v-else class="connections-tab" role="region">
            <header class="tab-copy">
              <h2 id="tab-connections">LDAP Bağlantıları</h2>
              <p>Sunucu bağlantılarını gözlemleyin ve yapılandırmaları yönetin.</p>
            </header>
            <div class="table-wrapper">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Ad</th>
                    <th scope="col">Sunucu</th>
                    <th scope="col">Port</th>
                    <th scope="col">Base DN</th>
                    <th scope="col">Kullanıcı</th>
                    <th scope="col" class="actions">İşlemler</th>
                  </tr>
                </thead>
                <tbody v-if="integrationRows.length">
                  <tr v-for="integration in integrationRows" :key="integration.id">
                    <td data-title="Ad">{{ integration.name }}</td>
                    <td data-title="Sunucu">{{ integration.server }}</td>
                    <td data-title="Port">{{ integration.port }}</td>
                    <td data-title="Base DN">{{ integration.baseDn }}</td>
                    <td data-title="Kullanıcı">{{ integration.username }}</td>
                    <td data-title="İşlemler" class="actions">
                      <button type="button" class="link-button" @click="configureIntegration(integration)">
                        Ayarla
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="6" class="empty-state">Kayıt yok.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

type RouteName =
  | 'home'
  | 'inventory-tracking'
  | 'license-tracking'
  | 'printer-tracking'
  | 'stock-tracking'
  | 'request-tracking'
  | 'knowledge-base'
  | 'scrap-management'
  | 'profile'
  | 'admin-panel'
  | 'records';

type TabId = 'users' | 'product' | 'connections';

interface TabItem {
  id: TabId;
  label: string;
  caption: string;
}

interface NavItem {
  label: string;
  route: RouteName;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface UserRow {
  id: string;
  order: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  routeName: RouteName;
}

interface ProductField {
  id: string;
  label: string;
  placeholder: string;
}

interface IntegrationRow {
  id: string;
  name: string;
  server: string;
  port: string;
  baseDn: string;
  username: string;
}

const router = useRouter();

const navGroups: NavGroup[] = [
  {
    title: 'Ana Sayfa',
    items: [
      { label: 'Ana Sayfa', route: 'home', icon: '🏠' }
    ]
  },
  {
    title: 'Envanter',
    items: [
      { label: 'Envanter Takip', route: 'inventory-tracking', icon: '📦' },
      { label: 'Lisans Takip', route: 'license-tracking', icon: '🪪' },
      { label: 'Yazıcı Takip', route: 'printer-tracking', icon: '🖨️' },
      { label: 'Stok Takip', route: 'stock-tracking', icon: '📊' }
    ]
  },
  {
    title: 'İşlemler',
    items: [
      { label: 'Talep Takip', route: 'request-tracking', icon: '🗂️' },
      { label: 'Bilgiler', route: 'knowledge-base', icon: '📘' },
      { label: 'Hurda', route: 'scrap-management', icon: '♻️' }
    ]
  },
  {
    title: 'Ayarlar',
    items: [
      { label: 'Profil', route: 'profile', icon: '👤' },
      { label: 'Admin Paneli', route: 'admin-panel', icon: '🛠️' },
      { label: 'Kayıtlar', route: 'records', icon: '🧾' }
    ]
  }
];

const tabItems: TabItem[] = [
  { id: 'users', label: 'Kullanıcı', caption: 'Yetkilendirme' },
  { id: 'product', label: 'Ürün Ekle', caption: 'Envanter' },
  { id: 'connections', label: 'Bağlantılar', caption: 'LDAP' }
];

const activeTab = ref<TabId>('users');
const searchQuery = ref('');

const userRows: UserRow[] = [
  {
    id: '1',
    order: 1,
    username: 'admin',
    fullName: 'Sistem Yöneticisi',
    email: 'admin@ornekfirma.com',
    role: 'Admin',
    routeName: 'profile'
  }
];

const productFields: ProductField[] = [
  { id: 'usage-area', label: 'Kullanım Alanı', placeholder: 'Örn. Ofis / Üretim' },
  { id: 'license-name', label: 'Lisans Adı', placeholder: 'Örn. Microsoft 365' },
  { id: 'category', label: 'Bilgi Kategorisi', placeholder: 'Yazılım / Donanım' },
  { id: 'factory', label: 'Fabrika', placeholder: 'Örn. İstanbul' },
  { id: 'hardware-type', label: 'Donanım Tipi', placeholder: 'Laptop / Yazıcı' },
  { id: 'brand', label: 'Marka', placeholder: 'Örn. Lenovo' },
  { id: 'model', label: 'Model', placeholder: 'Örn. ThinkPad T14' }
];

const integrationRows: IntegrationRow[] = [];

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return userRows;
  }

  return userRows.filter((user) => {
    return (
      user.username.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });
});

const activeUserCount = computed(() => userRows.length);
const isSearchDisabled = computed(() => activeTab.value !== 'users');

const toolbarButtonLabel = computed(() => {
  switch (activeTab.value) {
    case 'product':
      return 'Kaydet';
    case 'connections':
      return 'Bağlantı Ekle';
    default:
      return 'Yeni Kullanıcı';
  }
});

watch(activeTab, (tab) => {
  if (tab !== 'users') {
    searchQuery.value = '';
  }
});

const handleToolbarAction = () => {
  switch (activeTab.value) {
    case 'product':
      router.push({ name: 'inventory-tracking' });
      break;
    case 'connections':
      router.push({ name: 'knowledge-base' });
      break;
    default:
      router.push({ name: 'profile' });
      break;
  }
};

const goToProfile = (routeName: RouteName) => {
  router.push({ name: routeName });
};

const configureIntegration = (integration: IntegrationRow) => {
  console.info('Entegrasyon yapılandırması', integration);
  router.push({ name: 'records' });
};
</script>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  min-height: calc(100vh - 4rem);
  padding: 2.5rem 2rem;
  background: linear-gradient(180deg, #e0f2ff 0%, #f8fbff 100%);
  color: #0f172a;
}

.side-nav {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 50px rgba(37, 99, 235, 0.1);
  padding: 1.75rem 1.5rem;
  display: grid;
  gap: 1.5rem;
}

.nav-group {
  display: grid;
  gap: 0.6rem;
}

.nav-title {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #64748b;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.9rem;
  border-radius: 14px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link:hover,
.nav-link:focus-visible {
  background: rgba(37, 99, 235, 0.14);
  color: #1d4ed8;
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.2));
  color: #1e3a8a;
}

.nav-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(37, 99, 235, 0.12);
  font-size: 1rem;
}

.panel-area {
  display: grid;
  gap: 2rem;
}

.page-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 32px 60px rgba(15, 23, 42, 0.12);
  padding: 2rem 2.25rem;
}

.hero-copy {
  max-width: 520px;
  display: grid;
  gap: 0.75rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page-hero h1 {
  margin: 0;
  font-size: 2.15rem;
}

.page-hero p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.hero-stat {
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.16), rgba(59, 130, 246, 0.16));
  border-radius: 20px;
  padding: 1.25rem 1.6rem;
  display: grid;
  gap: 0.35rem;
  align-content: center;
  color: #0f172a;
}

.stat-label {
  margin: 0;
  font-size: 0.85rem;
  color: #1e3a8a;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stat-value {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
}

.stat-link {
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: none;
}

.panel-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 36px 70px rgba(15, 23, 42, 0.14);
  padding: 2.25rem;
  display: grid;
  gap: 1.75rem;
}

.panel-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
}

.tab-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tab-button {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  background: rgba(226, 232, 240, 0.6);
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  min-width: 150px;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.tab-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 30px rgba(37, 99, 235, 0.16);
}

.tab-button.active {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(125, 211, 252, 0.25));
  color: #1e3a8a;
  box-shadow: 0 24px 42px rgba(37, 99, 235, 0.24);
}

.tab-caption {
  font-size: 0.78rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.panel-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-field {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(248, 250, 252, 0.9);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.search-field input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #0f172a;
  min-width: 200px;
}

.search-field input::placeholder {
  color: rgba(100, 116, 139, 0.7);
}

.search-field.disabled {
  opacity: 0.55;
}

.search-field.disabled input {
  cursor: not-allowed;
}

.toolbar-button {
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f8fafc;
  font-weight: 600;
  padding: 0.75rem 1.65rem;
  cursor: pointer;
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.toolbar-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 46px rgba(37, 99, 235, 0.3);
}

.panel-body {
  display: grid;
  gap: 1.5rem;
}

.tab-copy {
  display: grid;
  gap: 0.35rem;
}

.tab-copy h2 {
  margin: 0;
  font-size: 1.45rem;
}

.tab-copy p {
  margin: 0;
  color: #475569;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(248, 250, 252, 0.95);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
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
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.admin-table thead th {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
  background: rgba(226, 232, 240, 0.4);
}

.admin-table tbody tr:last-child td {
  border-bottom: none;
}

.actions {
  text-align: right;
}

.link-button {
  border: none;
  background: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.link-button:hover,
.link-button:focus-visible {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: #64748b;
  font-weight: 500;
}

.product-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem 1.5rem;
}

.form-field {
  display: grid;
  gap: 0.45rem;
}

.form-field label {
  font-weight: 600;
  color: #1e293b;
}

.form-field input {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  padding: 0.7rem 0.9rem;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.9);
}

@media (max-width: 1100px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .side-nav {
    order: 2;
  }

  .panel-area {
    order: 1;
  }
}

@media (max-width: 720px) {
  .page-hero {
    flex-direction: column;
  }

  .panel-header {
    flex-direction: column;
    align-items: stretch;
  }

  .panel-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-field,
  .toolbar-button {
    width: 100%;
  }

  .tab-list {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
