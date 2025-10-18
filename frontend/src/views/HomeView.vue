<template>
  <section class="page-section" aria-labelledby="home-title">
    <header class="page-header">
      <h1 id="home-title">Ana Sayfa</h1>
      <p class="page-intro">
        Tüm takip modüllerinin özetini burada görüntüleyebilir, stok durumunu inceleyebilir ve
        gerçekleştirilen son işlemleri takip edebilirsiniz.
      </p>
    </header>

    <section class="metrics" aria-label="Genel sayılar">
      <template v-if="isMetricsLoading">
        <p class="section-empty">Metrikler yükleniyor...</p>
      </template>
      <template v-else>
        <article
          v-for="metric in summaryMetrics"
          :key="metric.id"
          class="metric-card"
          role="listitem"
        >
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          <p class="metric-caption">{{ metric.caption }}</p>
        </article>
      </template>
    </section>

    <section class="stocks" aria-labelledby="stock-status-title">
      <header class="section-header">
        <h2 id="stock-status-title">Stok Durumu</h2>
        <p>Stok takip modülünde seçtiğiniz kritik ürünlerin güncel adetleri.</p>
      </header>

      <div class="stock-grid" role="list">
        <template v-if="isStockLoading">
          <p class="section-empty">Stok kayıtları yükleniyor...</p>
        </template>
        <template v-else-if="highlightedStocks.length === 0">
          <p class="section-empty">Henüz stok kaydı bulunmuyor.</p>
        </template>
        <template v-else>
          <article v-for="item in highlightedStocks" :key="item.id" class="stock-card" role="listitem">
            <div class="stock-header">
              <span class="stock-name">{{ item.name }}</span>
              <span class="stock-category">{{ item.category }}</span>
            </div>
            <div class="stock-body">
              <span class="stock-quantity">{{ item.quantityText }}</span>
              <span class="stock-updated">{{ item.updatedAt }}</span>
            </div>
            <footer class="stock-footer">{{ item.note }}</footer>
          </article>
        </template>
      </div>
    </section>

    <section class="recent" aria-labelledby="recent-activity-title">
      <header class="section-header">
        <h2 id="recent-activity-title">Son İşlemler</h2>
        <p>En fazla 15 işlem listelenir. Detaylar için ilgili modül sayfasına geçiş yapın.</p>
      </header>

      <ol class="recent-list">
        <template v-if="isRecentLoading">
          <li class="recent-empty">İşlemler yükleniyor...</li>
        </template>
        <template v-else-if="limitedRecentOperations.length === 0">
          <li class="recent-empty">Henüz işlem kaydı yok.</li>
        </template>
        <template v-else>
          <li v-for="item in limitedRecentOperations" :key="item.id" class="recent-item">
            <div class="recent-meta">
              <span class="recent-module">{{ item.module }}</span>
              <span class="recent-date">{{ item.date }}</span>
            </div>
            <p class="recent-description">{{ item.description }}</p>
            <p v-if="item.note" class="recent-note">{{ item.note }}</p>
          </li>
        </template>
      </ol>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  fetchInventoryRecords,
  fetchLicenseRecords,
  fetchRequestRecords,
  fetchStockRecords,
  fetchAuditLogs,
  type InventoryEntity,
  type LicenseEntity,
  type RequestEntity,
  type StockEntity,
  type AuditLogEntity
} from '@/services/modules';

interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  caption: string;
}

interface HighlightedStock {
  id: string;
  name: string;
  category: string;
  quantityText: string;
  updatedAt: string;
  note: string;
}

interface RecentOperation {
  id: string;
  module: string;
  date: string;
  description: string;
  note?: string;
}

const inventoryRecords = ref<InventoryEntity[]>([]);
const licenseRecords = ref<LicenseEntity[]>([]);
const requestRecords = ref<RequestEntity[]>([]);
const stockRecords = ref<StockEntity[]>([]);
const auditLogs = ref<AuditLogEntity[]>([]);

const isMetricsLoading = ref(true);
const isStockLoading = ref(true);
const isRecentLoading = ref(true);

const categoryLabels: Record<string, string> = {
  envanter: 'Envanter',
  yazici: 'Yazıcı',
  lisans: 'Lisans',
  sistem: 'Sistem Odası'
};

const moduleLabels: Record<string, string> = {
  'inventory-tracking': 'Envanter',
  'license-tracking': 'Lisans',
  'printer-tracking': 'Yazıcı',
  'stock-tracking': 'Stok',
  'request-tracking': 'Talep',
  'scrap-management': 'Hurdalar',
  'knowledge-base': 'Bilgi Bankası',
  'admin-panel': 'Admin Paneli',
  records: 'Kayıtlar'
};

const parseQuantity = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
};

const toTimestamp = (value: string) => {
  const parsed = Date.parse(value);

  if (!Number.isNaN(parsed)) {
    return parsed;
  }

  const dotted = value.split('.');
  if (dotted.length === 3) {
    const [day, month, year] = dotted;
    const isoCandidate = `${year}-${month}-${day}`;
    const isoParsed = Date.parse(isoCandidate);

    if (!Number.isNaN(isoParsed)) {
      return isoParsed;
    }
  }

  return 0;
};

const loadMetrics = async () => {
  try {
    const [inventory, licenses, requests] = await Promise.all([
      fetchInventoryRecords(),
      fetchLicenseRecords(),
      fetchRequestRecords()
    ]);

    inventoryRecords.value = inventory;
    licenseRecords.value = licenses;
    requestRecords.value = requests;
  } catch (error) {
    console.error('Gösterge panosu metrikleri yüklenirken hata oluştu.', error);
  } finally {
    isMetricsLoading.value = false;
  }
};

const loadStock = async () => {
  try {
    stockRecords.value = await fetchStockRecords();
  } catch (error) {
    console.error('Stok özetleri yüklenirken hata oluştu.', error);
  } finally {
    isStockLoading.value = false;
  }
};

const loadRecentOperations = async () => {
  try {
    auditLogs.value = await fetchAuditLogs();
  } catch (error) {
    console.error('Son işlemler yüklenirken hata oluştu.', error);
  } finally {
    isRecentLoading.value = false;
  }
};

onMounted(() => {
  void loadMetrics();
  void loadStock();
  void loadRecentOperations();
});

const summaryMetrics = computed<SummaryMetric[]>(() => {
  const assigned = inventoryRecords.value.filter((record) => record.state === 'assigned').length;
  const available = inventoryRecords.value.filter((record) => record.state === 'available').length;
  const transfer = inventoryRecords.value.filter((record) => record.state === 'transfer').length;
  const faulty = inventoryRecords.value.filter((record) => record.state === 'faulty').length;

  const expiringLicenses = licenseRecords.value.filter((record) => record.status === 'expiring').length;
  const awaitingLicenses = licenseRecords.value.filter((record) => record.status === 'awaiting').length;

  const openRequests = requestRecords.value.filter((record) => record.status === 'open').length;
  const completedRequests = requestRecords.value.filter((record) => record.status === 'completed').length;
  const cancelledRequests = requestRecords.value.filter((record) => record.status === 'cancelled').length;

  return [
    {
      id: 'total-devices',
      label: 'Toplam Cihaz',
      value: String(inventoryRecords.value.length),
      caption: `Zimmetli: ${assigned} • Depoda: ${available}`
    },
    {
      id: 'licenses',
      label: 'Lisans',
      value: String(licenseRecords.value.length),
      caption: `Yenileme uyarısı: ${expiringLicenses} • Atama bekleyen: ${awaitingLicenses}`
    },
    {
      id: 'faulty-devices',
      label: 'Arızalı Cihaz',
      value: String(faulty),
      caption: `Transfer sürecinde: ${transfer}`
    },
    {
      id: 'open-requests',
      label: 'Açık Talep',
      value: String(openRequests),
      caption: `Tamamlanan: ${completedRequests} • İptal: ${cancelledRequests}`
    }
  ];
});

const highlightedStocks = computed<HighlightedStock[]>(() => {
  if (stockRecords.value.length === 0) {
    return [];
  }

  const grouped = new Map<
    string,
    {
      name: string;
      totalQuantity: number;
      category: string;
      latestDate: string;
      latestTimestamp: number;
      note: string;
    }
  >();

  stockRecords.value.forEach((record) => {
    const key = record.itemType.toLowerCase();
    const quantity = parseQuantity(record.quantity);
    const timestamp = toTimestamp(record.eventDate);

    const existing = grouped.get(key);

    if (!existing) {
      grouped.set(key, {
        name: record.itemType,
        totalQuantity: quantity,
        category: record.category ?? 'envanter',
        latestDate: record.eventDate,
        latestTimestamp: timestamp,
        note: record.description
      });
      return;
    }

    existing.totalQuantity += quantity;

    if (timestamp >= existing.latestTimestamp) {
      existing.latestTimestamp = timestamp;
      existing.latestDate = record.eventDate;
      existing.note = record.description;
      existing.category = record.category ?? existing.category;
    }
  });

  return Array.from(grouped.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 4)
    .map((group, index) => ({
      id: `stock-${index}-${group.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: group.name,
      category: categoryLabels[group.category] ?? 'Diğer',
      quantityText: `${new Intl.NumberFormat('tr-TR').format(group.totalQuantity)} adet`,
      updatedAt: group.latestDate,
      note: group.note
    }));
});

const recentOperations = computed<RecentOperation[]>(() =>
  auditLogs.value.map((log) => ({
    id: String(log.id),
    module: moduleLabels[log.routeName] ?? 'Kayıtlar',
    date: log.eventTime,
    description: log.title,
    note: log.detail
  }))
);

const limitedRecentOperations = computed(() => recentOperations.value.slice(0, 15));
</script>

<style scoped>
.page-section {
  display: grid;
  gap: 2.75rem;
  color: #0f172a;
}

.page-header h1 {
  margin: 0 0 0.75rem;
  font-size: 2.25rem;
}

.page-intro {
  margin: 0;
  max-width: 720px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}


.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.section-empty {
  grid-column: 1 / -1;
  margin: 0;
  padding: 1.5rem;
  border-radius: 18px;
  border: 1px dashed rgba(148, 163, 184, 0.45);
  background: rgba(241, 245, 249, 0.6);
  text-align: center;
  color: #475569;
  font-weight: 500;
}

.metric-card {
  padding: 1.85rem 1.75rem;
  border-radius: 18px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 0.65rem;
}

.metric-label {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.metric-value {
  font-size: 2.4rem;
  font-weight: 700;
  color: #0f172a;
}

.metric-caption {
  margin: 0;
  color: #475569;
  line-height: 1.55;
}

.section-header h2 {
  margin: 0;
  font-size: 1.65rem;
}

.section-header p {
  margin: 0.45rem 0 0;
  color: #475569;
  line-height: 1.6;
}

.stocks {
  display: grid;
  gap: 1.75rem;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.stock-card {
  display: grid;
  gap: 0.85rem;
  padding: 1.75rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
}

.stock-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  color: #1e293b;
  font-weight: 600;
}

.stock-category {
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.stock-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #0f172a;
}

.stock-quantity {
  font-size: 1.6rem;
  font-weight: 700;
}

.stock-updated {
  font-size: 0.9rem;
  color: #64748b;
}

.stock-footer {
  margin: 0;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
}

.recent {
  display: grid;
  gap: 1.5rem;
}


.recent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.2rem;
}

.recent-item {
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: #ffffff;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.07);
  display: grid;
  gap: 0.65rem;
}

.recent-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.recent-description {
  margin: 0;
  color: #1f2937;
  line-height: 1.55;
}

.recent-note {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.recent-empty {
  margin: 0;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px dashed rgba(148, 163, 184, 0.45);
  background: rgba(241, 245, 249, 0.6);
  color: #475569;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .page-section {
    gap: 2rem;
  }

  .metrics {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .stock-body {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .metric-value {
    font-size: 1.9rem;
  }
}
</style>
