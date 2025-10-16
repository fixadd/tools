<template>
  <section class="page-section" aria-labelledby="inventory-title">
    <header class="page-header">
      <h1 id="inventory-title">Envanter Takip</h1>
      <p class="page-intro">
        Bilgi işlem envanterinizi lokasyon, departman ve zimmet alanına göre yönetin. Stok
        hareketlerinden gelen cihazları hızla sahiplerine atayın ve lisans, yazıcı, stok modülleriyle
        tam entegrasyon sağlayın.
      </p>
    </header>

    <div class="page-panels">
      <article class="page-card highlight" aria-labelledby="inventory-summary">
        <h2 id="inventory-summary">Son Eklenen Cihazlar</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Varlık</th>
              <th scope="col">Departman</th>
              <th scope="col">Durum</th>
              <th scope="col">Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inventoryItems" :key="item.assetId">
              <td>
                <span class="asset-name">{{ item.name }}</span>
                <span class="asset-meta">{{ item.assetId }}</span>
              </td>
              <td>{{ item.department }}</td>
              <td>
                <span class="status" :class="`status--${item.status}`">{{ statusLabels[item.status] }}</span>
              </td>
              <td>{{ item.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="page-card" aria-labelledby="inventory-links">
        <h2 id="inventory-links">İlişkili Modüller</h2>
        <p>
          Stok modülünden gelen yeni cihazları zimmetlerken lisans eşleştirmesi yapabilir, arızalı
          cihazları yazıcı ve talep modülleriyle eşleştirip kayıt tutabilirsiniz.
        </p>
        <nav class="link-grid" aria-label="İlişkili sayfalar">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to" class="link-card">
            <span class="link-title">{{ link.title }}</span>
            <span class="link-meta">{{ link.description }}</span>
          </RouterLink>
        </nav>
      </article>

      <article class="page-card" aria-labelledby="inventory-log">
        <h2 id="inventory-log">Giriş / Çıkış Kayıtları</h2>
        <ul class="log-list">
          <li v-for="entry in movementLog" :key="entry.id" class="log-entry">
            <span class="log-time">{{ entry.time }}</span>
            <div class="log-content">
              <p class="log-text">{{ entry.text }}</p>
              <RouterLink v-if="entry.relatedRoute" class="log-link" :to="entry.relatedRoute">
                Detaya git
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
  assigned: 'Zimmetli',
  pending: 'Atama Bekliyor',
  maintenance: 'Bakımda'
} as const;

type InventoryStatus = keyof typeof statusLabels;

interface InventoryItem {
  assetId: string;
  name: string;
  department: string;
  status: InventoryStatus;
  updatedAt: string;
}

const inventoryItems: InventoryItem[] = [
  {
    assetId: 'NB-1042',
    name: 'Dell Latitude 7440',
    department: 'Finans',
    status: 'assigned',
    updatedAt: '2 saat önce'
  },
  {
    assetId: 'MNT-2034',
    name: 'LG 27UL500',
    department: 'Tasarım',
    status: 'pending',
    updatedAt: 'Dün'
  },
  {
    assetId: 'SRV-3012',
    name: 'HP ProLiant DL380',
    department: 'Data Center',
    status: 'maintenance',
    updatedAt: '3 gün önce'
  }
];

interface RelatedLink {
  title: string;
  description: string;
  to: { name: string };
}

const relatedLinks: RelatedLink[] = [
  {
    title: 'Stok Takip',
    description: 'Yeni teslim alınan cihazları stoktan aktarın.',
    to: { name: 'stock-tracking' }
  },
  {
    title: 'Lisans Takip',
    description: 'Cihazdaki yazılımları lisanslarla eşleştirin.',
    to: { name: 'license-tracking' }
  },
  {
    title: 'Yazıcı Takip',
    description: 'Paylaşılan yazıcı zimmetlerini görüntüleyin.',
    to: { name: 'printer-tracking' }
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
    time: 'Bugün 09:24',
    text: 'NB-1042 cihazı stoktan teslim alındı ve Finans departmanına zimmetlendi.',
    relatedRoute: { name: 'stock-tracking' }
  },
  {
    id: 2,
    time: 'Dün 16:17',
    text: 'LG 27UL500 monitörü için lisans eşleştirmesi tamamlandı.',
    relatedRoute: { name: 'license-tracking' }
  },
  {
    id: 3,
    time: 'Dün 10:05',
    text: 'SRV-3012 cihazı bakım için talep modülüne aktarıldı.'
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

.status--assigned {
  color: #0f5132;
  background: rgba(34, 197, 94, 0.15);
}

.status--assigned::before {
  background: #22c55e;
}

.status--pending {
  color: #713f12;
  background: rgba(249, 115, 22, 0.18);
}

.status--pending::before {
  background: #f97316;
}

.status--maintenance {
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.15);
}

.status--maintenance::before {
  background: #3b82f6;
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
