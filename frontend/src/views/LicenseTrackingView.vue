<template>
  <section class="license-tracking" aria-labelledby="license-title">
    <header class="page-hero">
      <div class="hero-text">
        <p class="hero-eyebrow">Yetki Merkezi</p>
        <h1 id="license-title">Lisans Takip</h1>
        <p class="hero-subtitle">
          Yazılım lisanslarını görüntüleyin ve yönetin. Anahtarların atama durumlarını, sorumlu ekipleri ve
          yenileme gereksinimlerini tek ekranda izleyin.
        </p>
        <div class="hero-links">
          <RouterLink :to="{ name: 'inventory-tracking' }" class="hero-link">Envantere git</RouterLink>
          <RouterLink :to="{ name: 'request-tracking' }" class="hero-link">Talep kuyruğunu aç</RouterLink>
          <RouterLink :to="{ name: 'records' }" class="hero-link">Kayıtları incele</RouterLink>
        </div>
      </div>
      <div class="hero-actions">
        <button type="button" class="action primary" @click="createLicense">+ Yeni lisans</button>
        <button type="button" class="action" @click="exportLicenses">Excel aktar</button>
        <button type="button" class="action outline" @click="toggleFilters">Filtre</button>
      </div>
    </header>

    <transition name="filter-panel">
      <aside v-if="filtersOpen" class="filter-drawer" aria-label="Lisans filtreleri">
        <header class="drawer-header">
          <h2>Filtreler</h2>
          <p>Durumlara göre hızlıca süzün veya anahtarları arayın.</p>
        </header>
        <form class="drawer-form" @submit.prevent>
          <fieldset>
            <legend>Durum</legend>
            <label v-for="segment in filterSegments" :key="segment.value" class="filter-option">
              <input
                type="radio"
                name="license-status"
                :value="segment.value"
                :checked="segment.value === selectedSegment"
                @change="() => applySegment(segment.value)"
              />
              <span>{{ segment.label }} ({{ segment.count }})</span>
            </label>
          </fieldset>
          <div class="filter-search">
            <label class="sr-only" for="license-search">Lisans ara</label>
            <input
              id="license-search"
              v-model="searchQuery"
              type="search"
              name="q"
              placeholder="Lisans adı veya anahtar ara"
            />
          </div>
          <div class="drawer-actions">
            <button type="button" class="action" @click="resetFilters">Filtreleri sıfırla</button>
            <button type="button" class="action outline" @click="toggleFilters">Kapat</button>
          </div>
        </form>
      </aside>
    </transition>

    <article class="license-card" aria-labelledby="license-table-title">
      <header class="card-header">
        <div>
          <h2 id="license-table-title">Lisanslar</h2>
          <p>
            Aktif, yenileme sürecinde ve atama bekleyen lisans anahtarlarını sorumlularıyla birlikte görüntüleyin.
          </p>
        </div>
        <dl class="card-metrics">
          <div v-for="metric in metrics" :key="metric.id">
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        </dl>
      </header>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Lisans adı</th>
              <th scope="col">Anahtar</th>
              <th scope="col">Sorumlu</th>
              <th scope="col">Bağlı ünvanlar</th>
              <th scope="col">E-posta</th>
              <th scope="col">Açıklama</th>
              <th scope="col" class="actions-header">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in filteredRecords" :key="record.id">
              <td data-title="No">{{ index + 1 }}</td>
              <td data-title="Lisans adı">
                <span class="cell-title">{{ record.name }}</span>
                <span class="status-tag" :class="`status-${record.status}`">{{ statusLabels[record.status] }}</span>
              </td>
              <td data-title="Anahtar">
                <code class="license-key">{{ record.key }}</code>
              </td>
              <td data-title="Sorumlu">
                <span class="cell-title">{{ record.owner }}</span>
                <span class="cell-meta">{{ record.ownerRole }}</span>
              </td>
              <td data-title="Bağlı ünvanlar">{{ record.linkedUnits }}</td>
              <td data-title="E-posta">{{ record.email }}</td>
              <td data-title="Açıklama">
                <span v-if="record.note" class="note">{{ record.note }}</span>
                <span v-else class="note muted">-</span>
              </td>
              <td data-title="İşlemler" class="actions-cell">
                <label class="sr-only" :for="`action-${record.id}`">{{ record.name }} işlemleri</label>
                <select
                  :id="`action-${record.id}`"
                  :value="selectedActions[record.id] ?? ''"
                  @change="(event) => handleActionChange(record, (event.target as HTMLSelectElement).value)"
                >
                  <option value="" disabled>Seçiniz...</option>
                  <option value="detail">Detaya git</option>
                  <option value="assign">Envantere yönlendir</option>
                  <option value="request">Talep oluştur</option>
                  <option value="cancel">Lisansı iptal et</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

interface LicenseRecord {
  id: number;
  name: string;
  key: string;
  owner: string;
  ownerRole: string;
  linkedUnits: string;
  email: string;
  status: 'active' | 'expiring' | 'awaiting';
  note?: string;
}

interface MetricItem {
  id: string;
  label: string;
  value: string;
}

interface FilterSegment {
  value: FilterValue;
  label: string;
  count: number;
}

type FilterValue = 'all' | 'active' | 'expiring' | 'awaiting';

const router = useRouter();

const licenseRecords = ref<LicenseRecord[]>([
  {
    id: 1,
    name: 'Microsoft 365 E3',
    key: 'MSFT-O365-84J2',
    owner: 'Sistem Yöneticisi',
    ownerRole: 'Bulut Ekibi',
    linkedUnits: 'Finans, Operasyon',
    email: 'sistem@acme.com',
    status: 'active'
  },
  {
    id: 2,
    name: 'Adobe Creative Cloud',
    key: 'ADBE-CC-10S9',
    owner: 'Tasarım Koordinatörü',
    ownerRole: 'Tasarım Ekibi',
    linkedUnits: 'Tasarım, Pazarlama',
    email: 'design@acme.com',
    status: 'expiring',
    note: '7 gün içinde yenileme gerekiyor.'
  },
  {
    id: 3,
    name: 'JetBrains IntelliJ IDEA',
    key: 'JETB-INT-660P',
    owner: 'Ar-Ge Lideri',
    ownerRole: 'Yazılım Ekibi',
    linkedUnits: 'Ar-Ge',
    email: 'rge@acme.com',
    status: 'awaiting',
    note: 'Yeni cihaz ataması bekliyor.'
  },
  {
    id: 4,
    name: 'Autodesk AutoCAD',
    key: 'AUTO-CAD-332T',
    owner: 'Proje Müdürü',
    ownerRole: 'Mimari Tasarım',
    linkedUnits: 'Mimari, Saha',
    email: 'proje@acme.com',
    status: 'active'
  }
]);

const statusLabels = {
  active: 'Aktif',
  expiring: 'Yenileme Yakın',
  awaiting: 'Atama Bekliyor'
} as const;

const selectedActions = reactive<Record<number, string>>({});
const filtersOpen = ref(false);
const selectedSegment = ref<FilterValue>('all');
const searchQuery = ref('');

const metrics = computed<MetricItem[]>(() => {
  const total = licenseRecords.value.length;
  const active = licenseRecords.value.filter((record) => record.status === 'active').length;
  const expiring = licenseRecords.value.filter((record) => record.status === 'expiring').length;
  const awaiting = licenseRecords.value.filter((record) => record.status === 'awaiting').length;

  return [
    { id: 'total', label: 'Toplam', value: String(total) },
    { id: 'active', label: 'Aktif', value: String(active) },
    { id: 'expiring', label: 'Yenileme', value: String(expiring) },
    { id: 'awaiting', label: 'Bekleyen', value: String(awaiting) }
  ];
});

const filterSegments = computed<FilterSegment[]>(() => {
  const counts: Record<FilterValue, number> = {
    all: licenseRecords.value.length,
    active: licenseRecords.value.filter((record) => record.status === 'active').length,
    expiring: licenseRecords.value.filter((record) => record.status === 'expiring').length,
    awaiting: licenseRecords.value.filter((record) => record.status === 'awaiting').length
  };

  return [
    { value: 'all', label: 'Tüm lisanslar', count: counts.all },
    { value: 'active', label: 'Aktif kullanım', count: counts.active },
    { value: 'expiring', label: 'Yenileme uyarısı', count: counts.expiring },
    { value: 'awaiting', label: 'Atama bekleyen', count: counts.awaiting }
  ];
});

const filteredRecords = computed(() => {
  const normalizedQuery = searchQuery.value.trim().toLowerCase();

  return licenseRecords.value.filter((record) => {
    const segmentMatch =
      selectedSegment.value === 'all' || record.status === selectedSegment.value;

    const queryMatch =
      !normalizedQuery ||
      record.name.toLowerCase().includes(normalizedQuery) ||
      record.key.toLowerCase().includes(normalizedQuery) ||
      record.owner.toLowerCase().includes(normalizedQuery);

    return segmentMatch && queryMatch;
  });
});

const toggleFilters = () => {
  filtersOpen.value = !filtersOpen.value;
};

const applySegment = (value: FilterValue) => {
  selectedSegment.value = value;
};

const resetFilters = () => {
  selectedSegment.value = 'all';
  searchQuery.value = '';
};

const createLicense = () => {
  window.alert('Yeni lisans oluşturma akışı yakında burada olacak.');
};

const exportLicenses = () => {
  window.alert('Lisans listesi excel çıktısı olarak dışa aktarılıyor.');
};

const askForCancellationReason = (record: LicenseRecord) => {
  const reason = window.prompt('Lisans iptal sebebini giriniz:', record.note ?? '');
  if (!reason) {
    return;
  }

  record.status = 'awaiting';
  record.note = `İptal edildi: ${reason}`;
};

const handleActionChange = (record: LicenseRecord, value: string) => {
  if (!value) {
    return;
  }

  switch (value) {
    case 'detail':
      router.push({ name: 'records', query: { license: record.key } });
      break;
    case 'assign':
      router.push({ name: 'inventory-tracking', query: { focus: record.key } });
      break;
    case 'request':
      router.push({ name: 'request-tracking', query: { license: record.key } });
      break;
    case 'cancel':
      askForCancellationReason(record);
      break;
    default:
      break;
  }

  selectedActions[record.id] = '';
};
</script>

<style scoped>
.license-tracking {
  display: grid;
  gap: 2rem;
  color: #0f172a;
}

.page-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 28px;
  padding: 2.5rem;
  box-shadow: 0 25px 70px rgba(59, 130, 246, 0.18);
}

.hero-text {
  max-width: 620px;
  display: grid;
  gap: 0.75rem;
}

.hero-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2563eb;
  font-weight: 700;
}

.hero-text h1 {
  margin: 0;
  font-size: 2.25rem;
}

.hero-subtitle {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.hero-link {
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: none;
}

.hero-link:hover {
  text-decoration: underline;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.75);
  color: #1e3a8a;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(148, 163, 184, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action.primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f8fafc;
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.35);
}

.action.outline {
  background: transparent;
  border: 1px solid rgba(37, 99, 235, 0.4);
  color: #1d4ed8;
}

.action:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(148, 163, 184, 0.35);
}

.filter-panel-enter-active,
.filter-panel-leave-active {
  transition: opacity 0.2s ease;
}

.filter-panel-enter-from,
.filter-panel-leave-to {
  opacity: 0;
}

.filter-drawer {
  background: rgba(248, 250, 252, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 24px;
  padding: 1.75rem;
  display: grid;
  gap: 1.5rem;
  box-shadow: 0 20px 48px rgba(15, 23, 42, 0.18);
}

.drawer-header h2 {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
}

.drawer-header p {
  margin: 0;
  color: #475569;
}

.drawer-form {
  display: grid;
  gap: 1.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: #1e293b;
}

.filter-search input {
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #ffffff;
  font-size: 0.95rem;
}

.drawer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.license-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 2rem;
  display: grid;
  gap: 1.75rem;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.12);
}

.card-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.75rem;
  align-items: flex-start;
}

.card-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.card-header p {
  margin: 0;
  color: #475569;
}

.card-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 1rem;
  margin: 0;
}

.card-metrics div {
  background: rgba(37, 99, 235, 0.08);
  border-radius: 16px;
  padding: 0.85rem 1rem;
  text-align: center;
}

.card-metrics dt {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1e3a8a;
}

.card-metrics dd {
  margin: 0.35rem 0 0;
  font-size: 1.35rem;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  padding: 0.9rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

th {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: #475569;
}

tbody tr:hover {
  background: rgba(226, 232, 240, 0.35);
}

.cell-title {
  display: block;
  font-weight: 600;
  color: #0f172a;
}

.cell-meta {
  display: block;
  color: #475569;
  font-size: 0.85rem;
}

.license-key {
  background: rgba(37, 99, 235, 0.08);
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  color: #1d4ed8;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  margin-top: 0.45rem;
}

.status-active {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.status-expiring {
  background: rgba(249, 115, 22, 0.18);
  color: #c2410c;
}

.status-awaiting {
  background: rgba(37, 99, 235, 0.14);
  color: #1d4ed8;
}

.note {
  display: block;
  max-width: 220px;
  line-height: 1.45;
}

.note.muted {
  color: #94a3b8;
}

.actions-cell select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: #ffffff;
  font-size: 0.9rem;
}

.actions-header {
  min-width: 160px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 960px) {
  .page-hero {
    padding: 2rem;
  }

  .card-header {
    flex-direction: column;
  }

  th,
  td {
    padding: 0.75rem;
  }
}

@media (max-width: 720px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead {
    display: none;
  }

  tbody tr {
    margin-bottom: 1rem;
    border-radius: 16px;
    border: 1px solid rgba(148, 163, 184, 0.25);
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.88);
  }

  td {
    border: none;
    padding: 0.5rem 0;
  }

  td::before {
    content: attr(data-title);
    display: block;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 0.35rem;
  }

  .actions-cell select {
    width: 100%;
  }
}
</style>
