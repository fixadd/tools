<template>
  <section class="page-section" aria-labelledby="stock-title">
    <header class="page-header">
      <h1 id="stock-title">Stok Takip</h1>
      <p class="page-intro">
        Talep modülünden gelen cihaz, lisans ve yazıcı ihtiyaçları bu depoda bekler. Onaylanan
        hareketleri ilgili modüllere aktarın, kullanılmayan varlıkları geri alarak stok dengesini
        yönetin.
      </p>
    </header>

    <div class="page-panels">
      <article class="page-card highlight" aria-labelledby="stock-overview">
        <h2 id="stock-overview">Bekleyen Varlıklar</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Kalem</th>
              <th scope="col">Kaynak</th>
              <th scope="col">Hedef Modül</th>
              <th scope="col">Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stockItems" :key="item.id">
              <td>
                <span class="asset-name">{{ item.name }}</span>
                <span class="asset-meta">{{ item.code }}</span>
              </td>
              <td>{{ item.requestOrigin }}</td>
              <td>
                <RouterLink :to="item.targetRoute" class="inline-link">{{ item.target }}</RouterLink>
              </td>
              <td>
                <span class="status" :class="`status--${item.status}`">{{ statusLabels[item.status] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="page-card" aria-labelledby="stock-flow">
        <h2 id="stock-flow">Akış Şeması</h2>
        <ol class="flow-list">
          <li>Talep Takip modülünden gelen ihtiyaçlar stokta doğrulama için sıralanır.</li>
          <li>Hazır olan varlıklar <RouterLink :to="{ name: 'inventory-tracking' }" class="inline-link">Envanter</RouterLink>, <RouterLink :to="{ name: 'license-tracking' }" class="inline-link">Lisans</RouterLink> ve <RouterLink :to="{ name: 'printer-tracking' }" class="inline-link">Yazıcı</RouterLink> modüllerine aktarılır.</li>
          <li>İade edilen veya boşa çıkan ürünler kontrol sonrası tekrar stok kaydına alınır.</li>
        </ol>
        <nav class="link-grid" aria-label="Hızlı bağlantılar">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to" class="link-card">
            <span class="link-title">{{ link.title }}</span>
            <span class="link-meta">{{ link.description }}</span>
          </RouterLink>
        </nav>
      </article>

      <article class="page-card" aria-labelledby="stock-log">
        <h2 id="stock-log">Giriş / Çıkış Logu</h2>
        <ul class="log-list">
          <li v-for="entry in movementLog" :key="entry.id" class="log-entry">
            <span class="log-time">{{ entry.time }}</span>
            <div class="log-content">
              <p class="log-text">{{ entry.text }}</p>
              <RouterLink v-if="entry.relatedRoute" class="log-link" :to="entry.relatedRoute">
                Kaydı aç
              </RouterLink>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const statusLabels = {
  awaiting: 'Talep Kontrolü',
  prepared: 'Çıkışa Hazır',
  'in-progress': 'Aktarım Yapılıyor',
  returned: 'İadeden Geldi'
} as const;

type StockStatus = keyof typeof statusLabels;

interface StockItem {
  id: number;
  name: string;
  code: string;
  requestOrigin: string;
  target: string;
  targetRoute: { name: string };
  status: StockStatus;
}

const stockItems: StockItem[] = [
  {
    id: 1,
    name: 'Dell Latitude 7440',
    code: 'NB-1051',
    requestOrigin: 'Talep #458 / İnsan Kaynakları',
    target: 'Envanter Takip',
    targetRoute: { name: 'inventory-tracking' },
    status: 'awaiting'
  },
  {
    id: 2,
    name: 'Microsoft Visio Professional',
    code: 'LIC-212',
    requestOrigin: 'Talep #461 / Proje Yönetimi',
    target: 'Lisans Takip',
    targetRoute: { name: 'license-tracking' },
    status: 'prepared'
  },
  {
    id: 3,
    name: 'HP LaserJet Pro M428 Toner',
    code: 'STK-TON-98',
    requestOrigin: 'Talep #452 / Satış',
    target: 'Yazıcı Takip',
    targetRoute: { name: 'printer-tracking' },
    status: 'in-progress'
  },
  {
    id: 4,
    name: 'Dell Latitude 5410',
    code: 'NB-0992',
    requestOrigin: 'İade / Finans Departmanı',
    target: 'Envanter Takip',
    targetRoute: { name: 'inventory-tracking' },
    status: 'returned'
  }
];

interface RelatedLink {
  title: string;
  description: string;
  to: { name: string };
}

const relatedLinks: RelatedLink[] = [
  {
    title: 'Talep Takip',
    description: 'Gelen talepleri doğrulayıp stok girişine alın.',
    to: { name: 'request-tracking' }
  },
  {
    title: 'Kayıtlar',
    description: 'Geçmiş giriş/çıkış raporlarına göz atın.',
    to: { name: 'records' }
  }
];

interface MovementLogEntry {
  id: number;
  time: string;
  text: string;
  relatedRoute?: { name: string };
}

const movementLog: MovementLogEntry[] = [
  {
    id: 1,
    time: 'Bugün 14:20',
    text: 'NB-1051 cihazı depoya giriş yaptı, envanter onayı bekliyor.',
    relatedRoute: { name: 'inventory-tracking' }
  },
  {
    id: 2,
    time: 'Bugün 09:55',
    text: 'LIC-212 lisansı envanterdeki NB-2004 cihazına atandı ve stoktan düşüldü.',
    relatedRoute: { name: 'license-tracking' }
  },
  {
    id: 3,
    time: 'Dün 18:10',
    text: 'STK-TON-98 kalemi yazıcı modülüne aktarıldı, talep #452 kapatıldı.',
    relatedRoute: { name: 'printer-tracking' }
  },
  {
    id: 4,
    time: 'Dün 11:32',
    text: 'NB-0992 cihazı Finans departmanından iade alındı ve stokta tekrar listelendi.'
  }
];

</script>

<style scoped>
.page-section {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.page-header h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

.page-intro {
  margin: 0;
  max-width: 780px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.page-panels {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
}

.page-card {
  padding: 2.25rem;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 1.4rem;
}

.page-card.highlight {
  grid-column: 1 / -1;
}

.page-card h2 {
  margin: 0;
  font-size: 1.4rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.data-table thead th {
  text-align: left;
  color: #64748b;
  font-weight: 600;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.data-table tbody td {
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  vertical-align: top;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.asset-name {
  display: block;
  font-weight: 600;
}

.asset-meta {
  display: block;
  font-size: 0.8rem;
  color: #94a3b8;
}

.inline-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.inline-link:hover {
  text-decoration: underline;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
}

.status--awaiting {
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.15);
}

.status--awaiting::before {
  background: #3b82f6;
}

.status--prepared {
  color: #0f5132;
  background: rgba(34, 197, 94, 0.15);
}

.status--prepared::before {
  background: #22c55e;
}

.status--in-progress {
  color: #78350f;
  background: rgba(251, 191, 36, 0.18);
}

.status--in-progress::before {
  background: #fbbf24;
}

.status--returned {
  color: #581c87;
  background: rgba(192, 132, 252, 0.2);
}

.status--returned::before {
  background: #c084fc;
}

.flow-list {
  margin: 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.75rem;
  color: #475569;
  line-height: 1.5;
}

.link-grid {
  display: grid;
  gap: 1rem;
}

.link-card {
  display: grid;
  gap: 0.2rem;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.link-card:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
}

.link-title {
  font-weight: 600;
}

.link-meta {
  font-size: 0.85rem;
  color: #64748b;
}

.log-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.log-entry {
  display: grid;
  gap: 0.25rem;
}

.log-time {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

.log-content {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.log-text {
  margin: 0;
  color: #475569;
  line-height: 1.4;
}

.log-link {
  font-size: 0.8rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.log-link:hover {
  text-decoration: underline;
}
</style>
