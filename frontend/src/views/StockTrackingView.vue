<template>
  <section class="stock-page" aria-labelledby="stock-title">
    <aside class="module-nav" aria-label="Modüller">
      <p class="nav-title">Modüller</p>
      <RouterLink
        v-for="link in navigation"
        :key="link.label"
        :to="link.to"
        class="nav-link"
        :class="{ active: link.routeName === 'stock-tracking' }"
      >
        {{ link.label }}
      </RouterLink>
    </aside>

    <div class="stock-content">
      <header class="stock-header">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <RouterLink :to="{ name: 'home' }">Ana Sayfa</RouterLink>
            <span aria-hidden="true">/</span>
            <span>Stok Takip</span>
          </nav>
          <h1 id="stock-title">Stok Yönetimi</h1>
          <p class="header-description">
            Donanım, yazıcı ve lisans stok hareketlerini ilgili modüllere yönlendirerek kayıt akışını
            yönetin. Talep ve envanter ekipleriyle bağlantılı çalışın.
          </p>
        </div>
        <div class="header-actions">
          <RouterLink :to="{ name: 'records' }" class="secondary-action">Arıza Durumu</RouterLink>
          <RouterLink :to="{ name: 'inventory-tracking' }" class="primary-action">Anlık Durum</RouterLink>
        </div>
      </header>

      <section class="toolbar">
        <div class="status-cards">
          <article v-for="stat in heroStats" :key="stat.id" class="status-card">
            <p class="status-label">{{ stat.label }}</p>
            <p class="status-value">{{ stat.value }}</p>
            <p class="status-note">{{ stat.note }}</p>
          </article>
        </div>
        <div class="search-box">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Ara"
            aria-label="Stokta ara"
          />
        </div>
      </section>

      <section class="stock-panel" aria-labelledby="tab-stock">
        <header class="panel-header">
          <div class="panel-tabs" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :id="`tab-${tab.id}`"
              role="tab"
              type="button"
              :aria-controls="`panel-${tab.id}`"
              :aria-selected="activeTab === tab.id"
              :class="['panel-tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          <RouterLink :to="{ name: 'request-tracking' }" class="link-button">
            Talep kuyruğunu aç
          </RouterLink>
        </header>

        <div
          v-if="activeTab === 'stock'"
          :id="'panel-stock'"
          role="tabpanel"
          :aria-labelledby="'tab-stock'"
          class="tab-content"
        >
          <div class="segment-filters" role="group" aria-label="Stok segmentleri">
            <button
              v-for="segment in segments"
              :key="segment.id"
              type="button"
              :class="['segment-button', { active: activeSegment === segment.id }]"
              @click="activeSegment = segment.id"
            >
              {{ segment.label }}
            </button>
            <button type="button" class="segment-button outlined" @click="resetFilters">
              Seçilenleri Sıfırla
            </button>
          </div>

          <table class="stock-table">
            <thead>
              <tr>
                <th scope="col">IFS No</th>
                <th scope="col">Donanım Tipi</th>
                <th scope="col">Marka</th>
                <th scope="col">Model</th>
                <th scope="col">Miktar</th>
                <th scope="col">Tarih</th>
                <th scope="col">Açıklama</th>
                <th scope="col">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredStock" :key="item.id">
                <td data-title="IFS No">{{ item.ifsNo }}</td>
                <td data-title="Donanım Tipi">{{ item.type }}</td>
                <td data-title="Marka">{{ item.brand }}</td>
                <td data-title="Model">{{ item.model }}</td>
                <td data-title="Miktar">{{ item.quantity }}</td>
                <td data-title="Tarih">{{ item.date }}</td>
                <td data-title="Açıklama">
                  <span>{{ item.description }}</span>
                  <small v-if="item.cancelReason" class="cancel-reason">
                    İptal Notu: {{ item.cancelReason }}
                  </small>
                </td>
                <td data-title="İşlemler" class="actions">
                  <button type="button" class="stock-action" @click="handleStockIn(item)">
                    Stok Gir
                  </button>
                  <button type="button" class="cancel-action" @click="handleCancel(item)">
                    İptal
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredStock.length">
                <td colspan="8" class="empty">Stok bulunamadı</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-else
          :id="'panel-log'"
          role="tabpanel"
          :aria-labelledby="'tab-log'"
          class="tab-content"
        >
          <ul class="log-list">
            <li v-for="entry in movementLog" :key="entry.id" class="log-entry">
              <div>
                <p class="log-title">{{ entry.title }}</p>
                <p class="log-meta">{{ entry.time }}</p>
              </div>
              <RouterLink v-if="entry.route" :to="entry.route" class="log-link">
                Kaydı aç
              </RouterLink>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

interface NavigationLink {
  label: string;
  to: RouteLocationRaw;
  routeName?: string;
}

interface HeroStat {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface Segment {
  id: string;
  label: string;
}

interface StockRow {
  id: number;
  ifsNo: string;
  type: string;
  brand: string;
  model: string;
  quantity: string;
  date: string;
  description: string;
  category: Segment['id'];
  cancelReason?: string;
}

interface MovementEntry {
  id: number;
  title: string;
  time: string;
  route?: RouteLocationRaw;
}

const navigation: NavigationLink[] = [
  { label: 'Ana Sayfa', to: { name: 'home' }, routeName: 'home' },
  { label: 'Envanter Takip', to: { name: 'inventory-tracking' }, routeName: 'inventory-tracking' },
  { label: 'Talep Takip', to: { name: 'request-tracking' }, routeName: 'request-tracking' },
  { label: 'Lisans Takip', to: { name: 'license-tracking' }, routeName: 'license-tracking' },
  { label: 'Yazıcı Takip', to: { name: 'printer-tracking' }, routeName: 'printer-tracking' },
  { label: 'Hurda', to: { name: 'scrap-management' }, routeName: 'scrap-management' },
  { label: 'Kayıtlar', to: { name: 'records' }, routeName: 'records' }
];

const heroStats: HeroStat[] = [
  { id: 'incoming', label: 'Bekleyen Giriş', value: '14', note: 'Talep kuyruğundan doğrulanmayı bekliyor' },
  { id: 'prepared', label: 'Çıkışa Hazır', value: '7', note: 'Envanter aktarımına hazır kalem' },
  { id: 'returned', label: 'İadeden Gelen', value: '3', note: 'Kontrolden sonra stokta tutulanlar' }
];

const tabs = [
  { id: 'stock', label: 'Stok Durumu' },
  { id: 'log', label: 'Log' }
] as const;

const segments: Segment[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'envanter', label: 'Envanter' },
  { id: 'yazici', label: 'Yazıcı' },
  { id: 'lisans', label: 'Lisanslar' },
  { id: 'sistem', label: 'Sistem Odası' }
];

const searchTerm = ref('');
const activeTab = ref<typeof tabs[number]['id']>('stock');
const activeSegment = ref<Segment['id']>('all');

const stockRows = ref<StockRow[]>([
  {
    id: 1,
    ifsNo: 'IFS-48765',
    type: 'Laptop',
    brand: 'Lenovo',
    model: 'ThinkPad T14',
    quantity: '5',
    date: '08.04.2024',
    description: 'Yeni ekip ataması için beklemede',
    category: 'envanter'
  },
  {
    id: 2,
    ifsNo: 'IFS-48801',
    type: 'Lisans',
    brand: 'Microsoft',
    model: 'Office 365 E5',
    quantity: '12',
    date: '07.04.2024',
    description: 'Güvenlik ekibine tahsis edilecek',
    category: 'lisans'
  },
  {
    id: 3,
    ifsNo: 'IFS-48842',
    type: 'Yazıcı',
    brand: 'HP',
    model: 'LaserJet Pro M404dn',
    quantity: '2',
    date: '05.04.2024',
    description: 'Bölge ofisinden iade edildi',
    category: 'yazici'
  },
  {
    id: 4,
    ifsNo: 'IFS-48915',
    type: 'Sunucu',
    brand: 'Dell',
    model: 'PowerEdge R760',
    quantity: '1',
    date: '02.04.2024',
    description: 'Yeni sistem odası kurulumu',
    category: 'sistem'
  }
]);

const movementLog = computed<MovementEntry[]>(() => [
  {
    id: 1,
    title: 'IFS-48765 stok girişi onaylandı, envantere aktarıldı.',
    time: '08.04.2024 11:32',
    route: { name: 'inventory-tracking' }
  },
  {
    id: 2,
    title: 'IFS-48801 lisans kaydı bilgi işlem tarafından talep edildi.',
    time: '07.04.2024 09:15',
    route: { name: 'license-tracking' }
  },
  {
    id: 3,
    title: 'IFS-48842 yazıcı kontrol sonrası stokta tutuluyor.',
    time: '06.04.2024 16:54',
    route: { name: 'printer-tracking' }
  },
  {
    id: 4,
    title: 'IFS-48915 sistem odası kurulum kaydı açıldı.',
    time: '02.04.2024 14:28',
    route: { name: 'records' }
  }
]);

const filteredStock = computed(() => {
  const query = searchTerm.value.trim().toLowerCase();

  return stockRows.value.filter((row) => {
    const matchesSegment =
      activeSegment.value === 'all' ? true : row.category === activeSegment.value;

    const matchesQuery =
      !query ||
      [row.ifsNo, row.type, row.brand, row.model, row.description]
        .join(' ')
        .toLowerCase()
        .includes(query);

    return matchesSegment && matchesQuery;
  });
});

function handleStockIn(row: StockRow) {
  row.cancelReason = undefined;
  row.description = 'Envantere aktarıldı, zimmet bekleniyor';
}

function handleCancel(row: StockRow) {
  const reason = window.prompt('İptal sebebini girin');
  if (!reason) {
    return;
  }

  row.cancelReason = reason;
  row.description = 'Talep kapatıldı, depoda bekliyor';
}

function resetFilters() {
  activeSegment.value = 'all';
  searchTerm.value = '';
}
</script>

<style scoped>
.stock-page {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  background: linear-gradient(180deg, #f1f5ff 0%, #ffffff 38%);
  min-height: 100vh;
  padding: 2.5rem 2rem;
  box-sizing: border-box;
}

.module-nav {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1.5rem 1.25rem;
  box-shadow: 0 20px 45px rgba(59, 130, 246, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.nav-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  color: #1f2937;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

.nav-link.active {
  background: #1d4ed8;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.18);
}

.stock-content {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 18px 40px rgba(59, 130, 246, 0.08);
  position: relative;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.75rem;
}

.breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #1d4ed8;
}

#stock-title {
  font-size: 2rem;
  color: #1e3a8a;
  margin: 0 0 0.5rem;
}

.header-description {
  max-width: 540px;
  color: #475569;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-action {
  background: linear-gradient(135deg, #fbbf24, #f97316);
  color: #0f172a;
}

.secondary-action {
  background: rgba(248, 113, 113, 0.18);
  color: #b91c1c;
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: center;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 16px 32px rgba(148, 163, 184, 0.16);
}

.status-label {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.35rem;
}

.status-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0;
}

.status-note {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.35rem;
}

.search-box input {
  width: 220px;
  border: none;
  border-radius: 999px;
  padding: 0.65rem 1.15rem;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.4);
  font-size: 0.95rem;
  color: #1f2937;
}

.search-box input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(37, 99, 235, 0.65);
}

.stock-panel {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(59, 130, 246, 0.12);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-tabs {
  display: inline-flex;
  gap: 0.75rem;
  background: rgba(226, 232, 240, 0.5);
  padding: 0.4rem;
  border-radius: 999px;
}

.panel-tab {
  border: none;
  background: transparent;
  font-weight: 600;
  color: #475569;
  padding: 0.45rem 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.panel-tab.active {
  background: #1d4ed8;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(29, 78, 216, 0.18);
}

.link-button {
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: none;
}

.segment-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.segment-button {
  border: none;
  background: rgba(226, 232, 240, 0.6);
  color: #1e293b;
  font-weight: 500;
  padding: 0.5rem 1.1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.segment-button.active {
  background: #38bdf8;
  color: #0f172a;
  box-shadow: 0 12px 24px rgba(56, 189, 248, 0.2);
}

.segment-button:hover {
  transform: translateY(-1px);
}

.segment-button.outlined {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #475569;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.6);
}

.stock-table thead {
  background: rgba(59, 130, 246, 0.08);
  color: #1e3a8a;
}

.stock-table th,
.stock-table td {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.9rem;
}

.stock-table tbody tr:nth-child(even) {
  background: rgba(248, 250, 252, 0.6);
}

.stock-table tbody tr:hover {
  background: rgba(224, 242, 254, 0.65);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stock-action,
.cancel-action {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.stock-action {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #022c22;
}

.cancel-action {
  background: rgba(252, 165, 165, 0.25);
  color: #b91c1c;
}

.stock-action:hover,
.cancel-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.empty {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #94a3b8;
}

.cancel-reason {
  display: block;
  margin-top: 0.35rem;
  color: #b91c1c;
  font-size: 0.8rem;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.log-entry {
  background: rgba(248, 250, 252, 0.8);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.6);
}

.log-title {
  font-weight: 600;
  margin: 0 0 0.35rem;
  color: #0f172a;
}

.log-meta {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}

.log-link {
  color: #1d4ed8;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .stock-page {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .module-nav {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-title {
    width: 100%;
  }

  .stock-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .toolbar {
    grid-template-columns: 1fr;
  }

  .search-box {
    justify-self: flex-start;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .stock-table,
  .stock-table thead,
  .stock-table tbody,
  .stock-table th,
  .stock-table td,
  .stock-table tr {
    display: block;
  }

  .stock-table thead {
    display: none;
  }

  .stock-table tbody tr {
    padding: 1rem;
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  }

  .stock-table td {
    padding: 0.4rem 0;
  }

  .stock-table td::before {
    content: attr(data-title);
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
    color: #1d4ed8;
  }

  .actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
