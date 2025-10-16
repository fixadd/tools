<template>
  <section class="page-section" aria-labelledby="printer-title">
    <header class="page-header">
      <h1 id="printer-title">Yazıcı Takip</h1>
      <p class="page-intro">
        Şirket yazıcılarının durumunu tek ekranda görün. Sarf malzeme seviyeleri, arıza kayıtları ve
        talep süreçleri ile tüm cihazların aktif durumunu yönetin.
      </p>
    </header>

    <div class="page-panels">
      <article class="page-card highlight" aria-labelledby="printer-overview">
        <h2 id="printer-overview">Cihaz Durum Özeti</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Cihaz</th>
              <th scope="col">Lokasyon</th>
              <th scope="col">Sarf Seviyesi</th>
              <th scope="col">Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="printer in printers" :key="printer.assetId">
              <td>
                <span class="asset-name">{{ printer.name }}</span>
                <span class="asset-meta">{{ printer.assetId }}</span>
              </td>
              <td>{{ printer.location }}</td>
              <td>
                <span class="status status--supply">{{ printer.supply }}</span>
              </td>
              <td>
                <span class="status" :class="`status--${printer.status}`">{{ statusLabels[printer.status] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="page-card" aria-labelledby="printer-links">
        <h2 id="printer-links">Entegrasyonlar</h2>
        <p>
          Stokta bekleyen toner ve kartuş taleplerini karşılayın, envanterdeki yazıcı zimmet
          bilgilerini güncelleyin ve lisans modülü üzerinden yazıcı yönetim konsollarını takip edin.
        </p>
        <nav class="link-grid" aria-label="İlgili sayfalar">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to" class="link-card">
            <span class="link-title">{{ link.title }}</span>
            <span class="link-meta">{{ link.description }}</span>
          </RouterLink>
        </nav>
      </article>

      <article class="page-card" aria-labelledby="printer-log">
        <h2 id="printer-log">Servis ve Sarf Kayıtları</h2>
        <ul class="log-list">
          <li v-for="entry in movementLog" :key="entry.id" class="log-entry">
            <span class="log-time">{{ entry.time }}</span>
            <div class="log-content">
              <p class="log-text">{{ entry.text }}</p>
              <RouterLink v-if="entry.relatedRoute" class="log-link" :to="entry.relatedRoute">
                İşleme git
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
  online: 'Çevrimiçi',
  warning: 'Düşük Sarf',
  maintenance: 'Servis Bekliyor'
} as const;

type PrinterStatus = keyof typeof statusLabels;

interface PrinterRow {
  assetId: string;
  name: string;
  location: string;
  supply: string;
  status: PrinterStatus;
}

const printers: PrinterRow[] = [
  {
    assetId: 'PRN-201',
    name: 'HP LaserJet Pro M428',
    location: 'Muhasebe',
    supply: 'Toner %65',
    status: 'online'
  },
  {
    assetId: 'PRN-312',
    name: 'Canon iR-ADV 525i',
    location: 'Satış',
    supply: 'Toner %28',
    status: 'warning'
  },
  {
    assetId: 'PRN-104',
    name: 'Epson Workforce WF-4830',
    location: 'Genel Kullanım',
    supply: 'Kartuş %12',
    status: 'maintenance'
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
    description: 'Toner ve kartuş stok hareketlerini inceleyin.',
    to: { name: 'stock-tracking' }
  },
  {
    title: 'Envanter Takip',
    description: 'Yazıcı zimmet bilgilerini güncelleyin.',
    to: { name: 'inventory-tracking' }
  },
  {
    title: 'Talep Takip',
    description: 'Servis ve sarf taleplerini yönetin.',
    to: { name: 'request-tracking' }
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
    time: 'Bugün 10:12',
    text: 'HP LaserJet Pro M428 cihazı için stoktan toner çıkışı yapıldı.',
    relatedRoute: { name: 'stock-tracking' }
  },
  {
    id: 2,
    time: 'Dün 15:40',
    text: 'Canon iR-ADV 525i için bakım talebi oluşturuldu.',
    relatedRoute: { name: 'request-tracking' }
  },
  {
    id: 3,
    time: 'Dün 09:05',
    text: 'Epson Workforce WF-4830 cihazı geçici olarak kullanım dışı işaretlendi.'
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

.status--supply {
  color: #1e293b;
  background: rgba(148, 163, 184, 0.18);
}

.status--supply::before {
  background: #94a3b8;
}

.status--online {
  color: #0f5132;
  background: rgba(34, 197, 94, 0.15);
}

.status--online::before {
  background: #22c55e;
}

.status--warning {
  color: #78350f;
  background: rgba(251, 191, 36, 0.18);
}

.status--warning::before {
  background: #fbbf24;
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
