<template>
  <section class="page-section" aria-labelledby="license-title">
    <header class="page-header">
      <h1 id="license-title">Lisans Takip</h1>
      <p class="page-intro">
        Kurumsal lisans envanterinizi sürüm, kullanım hakkı ve yenileme tarihine göre takip edin.
        Envanterdeki cihazlara atanmış anahtarları görün, stoktan gelen yeni kurulum taleplerini
        bekletmeden lisanslayın.
      </p>
    </header>

    <div class="page-panels">
      <article class="page-card highlight" aria-labelledby="license-overview">
        <h2 id="license-overview">Aktif Lisanslar</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Ürün</th>
              <th scope="col">Atama</th>
              <th scope="col">Durum</th>
              <th scope="col">Yenileme</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="license in licenseList" :key="license.key">
              <td>
                <span class="asset-name">{{ license.product }}</span>
                <span class="asset-meta">Anahtar: {{ license.key }}</span>
              </td>
              <td>{{ license.assignedTo }}</td>
              <td>
                <span class="status" :class="`status--${license.status}`">{{ statusLabels[license.status] }}</span>
              </td>
              <td>{{ license.renewal }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="page-card" aria-labelledby="license-actions">
        <h2 id="license-actions">Modüller Arası Akış</h2>
        <p>
          Talep modülündeki yazılım istekleri stokta kurulum için bekler. Cihaz teslim edildiğinde
          lisans anahtarını atayıp zimmet kaydını envanterde tamamlayabilirsiniz.
        </p>
        <nav class="link-grid" aria-label="İş akışı bağlantıları">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to" class="link-card">
            <span class="link-title">{{ link.title }}</span>
            <span class="link-meta">{{ link.description }}</span>
          </RouterLink>
        </nav>
      </article>

      <article class="page-card" aria-labelledby="license-log">
        <h2 id="license-log">Lisans Hareketleri</h2>
        <ul class="log-list">
          <li v-for="entry in movementLog" :key="entry.id" class="log-entry">
            <span class="log-time">{{ entry.time }}</span>
            <div class="log-content">
              <p class="log-text">{{ entry.text }}</p>
              <RouterLink v-if="entry.relatedRoute" class="log-link" :to="entry.relatedRoute">
                Kayda git
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
  active: 'Aktif',
  warning: 'Yenileme Yaklaşıyor',
  available: 'Atama Bekliyor'
} as const;

type LicenseStatus = keyof typeof statusLabels;

interface LicenseRow {
  key: string;
  product: string;
  assignedTo: string;
  status: LicenseStatus;
  renewal: string;
}

const licenseList: LicenseRow[] = [
  {
    key: 'MSFT-O365-84J2',
    product: 'Microsoft 365 E3',
    assignedTo: 'Finans / NB-1042',
    status: 'active',
    renewal: '30 gün kaldı'
  },
  {
    key: 'ADBE-CC-10S9',
    product: 'Adobe Creative Cloud',
    assignedTo: 'Tasarım / NB-2088',
    status: 'warning',
    renewal: '7 gün kaldı'
  },
  {
    key: 'JETB-INT-660P',
    product: 'JetBrains IntelliJ IDEA',
    assignedTo: 'Ar-Ge / NB-3001',
    status: 'available',
    renewal: 'Atama bekliyor'
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
    description: 'Kurulum bekleyen yazılımları stok üzerinden yönetin.',
    to: { name: 'stock-tracking' }
  },
  {
    title: 'Envanter Takip',
    description: 'Lisans atanan cihazların zimmetini doğrulayın.',
    to: { name: 'inventory-tracking' }
  },
  {
    title: 'Talep Takip',
    description: 'Yeni yazılım taleplerini değerlendirin.',
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
    time: 'Bugün 11:03',
    text: 'Microsoft 365 E3 lisansı NB-1042 cihazına atandı.',
    relatedRoute: { name: 'inventory-tracking' }
  },
  {
    id: 2,
    time: 'Bugün 08:45',
    text: 'Adobe Creative Cloud lisansı için yenileme uyarısı oluşturuldu.',
    relatedRoute: { name: 'records' }
  },
  {
    id: 3,
    time: 'Dün 17:20',
    text: 'JetBrains IntelliJ IDEA lisansı stokta boşta beklemeye alındı.',
    relatedRoute: { name: 'stock-tracking' }
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

.status--active {
  color: #0f5132;
  background: rgba(34, 197, 94, 0.15);
}

.status--active::before {
  background: #22c55e;
}

.status--warning {
  color: #78350f;
  background: rgba(251, 191, 36, 0.18);
}

.status--warning::before {
  background: #fbbf24;
}

.status--available {
  color: #1d4ed8;
  background: rgba(59, 130, 246, 0.15);
}

.status--available::before {
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
