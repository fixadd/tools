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
    </section>

    <section class="stocks" aria-labelledby="stock-status-title">
      <header class="section-header">
        <h2 id="stock-status-title">Stok Durumu</h2>
        <p>Stok takip modülünde seçtiğiniz kritik ürünlerin güncel adetleri.</p>
      </header>

      <div class="stock-grid" role="list">
        <article v-for="item in highlightedStocks" :key="item.id" class="stock-card" role="listitem">
          <div class="stock-header">
            <span class="stock-name">{{ item.name }}</span>
            <span class="stock-category">{{ item.category }}</span>
          </div>
          <div class="stock-body">
            <span class="stock-quantity">{{ item.quantity }} adet</span>
            <span class="stock-threshold" :class="{ warning: item.quantity <= item.threshold }">
              Minimum: {{ item.threshold }}
            </span>
          </div>
          <footer class="stock-footer">{{ item.note }}</footer>
        </article>
      </div>
    </section>

    <section class="recent" aria-labelledby="recent-activity-title">
      <header class="section-header">
        <h2 id="recent-activity-title">Son İşlemler</h2>
        <p>En fazla 15 işlem listelenir. Detaylar için ilgili modül sayfasına geçiş yapın.</p>
      </header>

      <ol class="recent-list">
        <li v-for="item in limitedRecentOperations" :key="item.id" class="recent-item">
          <div class="recent-meta">
            <span class="recent-module">{{ item.module }}</span>
            <span class="recent-date">{{ item.date }}</span>
          </div>
          <p class="recent-description">{{ item.description }}</p>
        </li>
      </ol>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
  quantity: number;
  threshold: number;
  note: string;
}

interface RecentOperation {
  id: string;
  module: string;
  date: string;
  description: string;
}

const summaryMetrics: SummaryMetric[] = [
  {
    id: 'total-devices',
    label: 'Toplam Cihaz',
    value: '482',
    caption: 'Son 30 günde 12 yeni cihaz eklendi'
  },
  {
    id: 'licenses',
    label: 'Lisans',
    value: '318',
    caption: '85 lisansın süresi 90 gün içinde yenilenecek'
  },
  {
    id: 'faulty-devices',
    label: 'Arızalı Cihaz',
    value: '7',
    caption: '3 cihaz teknik serviste, 4 cihaz parça bekliyor'
  },
  {
    id: 'open-requests',
    label: 'Açık Talep',
    value: '19',
    caption: '5 talep onay bekliyor, 14 talep hazırlık aşamasında'
  }
];

const highlightedStocks: HighlightedStock[] = [
  {
    id: 'laptop',
    name: 'Dizüstü Bilgisayar',
    category: 'Envanter',
    quantity: 24,
    threshold: 10,
    note: 'Son talep teslim edildi, 6 adet rezerve durumda.'
  },
  {
    id: 'license',
    name: 'Microsoft 365 E3',
    category: 'Lisans',
    quantity: 42,
    threshold: 30,
    note: 'Yeni kullanıcılar için 10 adet serbest lisans mevcut.'
  },
  {
    id: 'printer-toner',
    name: 'Toner - HP 83A',
    category: 'Yazıcı',
    quantity: 8,
    threshold: 8,
    note: 'Kritik seviyeye yaklaşıldı, tedarik talebi önerilir.'
  },
  {
    id: 'network-switch',
    name: '24 Port Switch',
    category: 'Stok',
    quantity: 15,
    threshold: 6,
    note: 'Depo sayımı güncel, 3 adet proje için ayrıldı.'
  }
];

const recentOperations: RecentOperation[] = [
  {
    id: 'op-001',
    module: 'Envanter',
    date: '12.05.2024 09:45',
    description: 'IT-00482 seri numaralı laptop Mehmet Yılmaz üzerine zimmetlendi.'
  },
  {
    id: 'op-002',
    module: 'Stok',
    date: '12.05.2024 08:50',
    description: 'HP 83A toner stoğundan 2 adet Yazıcı Takip modülüne aktarıldı.'
  },
  {
    id: 'op-003',
    module: 'Talep',
    date: '11.05.2024 17:12',
    description: '#451 nolu talep satın alma onayında bekliyor.'
  },
  {
    id: 'op-004',
    module: 'Bilgi Bankası',
    date: '11.05.2024 15:32',
    description: 'VPN kurulumu rehberi güncellendi.'
  },
  {
    id: 'op-005',
    module: 'Lisans',
    date: '11.05.2024 14:05',
    description: 'Adobe CC lisansı 3 kullanıcı için yenilendi.'
  },
  {
    id: 'op-006',
    module: 'Envanter',
    date: '11.05.2024 11:44',
    description: 'IT-00321 masaüstü bilgisayar hurdaya ayrıldı.'
  },
  {
    id: 'op-007',
    module: 'Kayıtlar',
    date: '11.05.2024 10:18',
    description: 'Yetki grubu "Destek" için stok görüntüleme izni verildi.'
  },
  {
    id: 'op-008',
    module: 'Yazıcı',
    date: '10.05.2024 19:22',
    description: 'YTR-102 etiket yazıcısı bakım planına alındı.'
  },
  {
    id: 'op-009',
    module: 'Talep',
    date: '10.05.2024 18:05',
    description: '#448 nolu talep teslim edildi ve envantere işlendi.'
  },
  {
    id: 'op-010',
    module: 'Stok',
    date: '10.05.2024 16:47',
    description: '24 port switch stoğuna 5 adet yeni ürün eklendi.'
  },
  {
    id: 'op-011',
    module: 'Profil',
    date: '10.05.2024 15:10',
    description: 'Ayşe Demir yetki grubu "Satın Alma" olarak güncellendi.'
  },
  {
    id: 'op-012',
    module: 'Lisans',
    date: '10.05.2024 12:53',
    description: 'Autodesk paket lisansları 2025 sonuna kadar uzatıldı.'
  },
  {
    id: 'op-013',
    module: 'Bilgi Bankası',
    date: '09.05.2024 20:15',
    description: 'Yeni çalışan başlangıç kontrol listesi yayınlandı.'
  },
  {
    id: 'op-014',
    module: 'Hurdalar',
    date: '09.05.2024 18:05',
    description: 'Hurda yazıcı envanterden düşülerek geri dönüşüme gönderildi.'
  },
  {
    id: 'op-015',
    module: 'Admin Paneli',
    date: '09.05.2024 16:40',
    description: 'LDAP bağlantısı test edildi ve başarıyla doğrulandı.'
  },
  {
    id: 'op-016',
    module: 'Kayıtlar',
    date: '09.05.2024 14:28',
    description: 'Sistem logları arşivlendi.'
  }
];

const limitedRecentOperations = computed(() => recentOperations.slice(0, 15));
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

.stock-threshold {
  font-size: 0.9rem;
  color: #22c55e;
}

.stock-threshold.warning {
  color: #dc2626;
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
