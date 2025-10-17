<template>
  <section class="workspace-page" aria-labelledby="inventory-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Zimmet Merkezi</span>
          <h1 id="inventory-title">Envanter Takip</h1>
          <p class="hero-intro">
            Bilgi işlem envanterinizi lokasyon, departman ve zimmet alanına göre yönetin. Stok
            hareketlerinden gelen cihazları hızla sahiplerine atayın ve lisans, yazıcı, stok modülleriyle
            tam entegrasyon sağlayın.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'stock-tracking' }" class="primary-action">Stok aktarımını incele</RouterLink>
          <RouterLink :to="{ name: 'request-tracking' }" class="secondary-link">Talep kuyruğuna dön</RouterLink>
        </div>
      </header>
      <dl class="hero-metrics">
        <div v-for="metric in heroMetrics" :key="metric.id">
          <dt>{{ metric.label }}</dt>
          <dd>{{ metric.value }}</dd>
          <p class="metric-note">{{ metric.note }}</p>
        </div>
      </dl>
    </article>

    <div class="workspace-grid columns-2">
      <article class="workspace-card table-card" aria-labelledby="inventory-summary">
        <header>
          <h2 id="inventory-summary">Son Eklenen Cihazlar</h2>
          <p>Stoktan gelen ve zimmetlenmeyi bekleyen cihazların listesi.</p>
        </header>
        <table>
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
                <span class="summary-title">{{ item.name }}</span>
                <p class="summary-meta">{{ item.assetId }}</p>
              </td>
              <td>{{ item.department }}</td>
              <td>
                <span class="status-chip">{{ statusLabels[item.status] }}</span>
              </td>
              <td>{{ item.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="workspace-card" aria-labelledby="inventory-links">
        <header>
          <h2 id="inventory-links">İlişkili Modüller</h2>
          <p>Envanter hareketlerini destekleyen diğer sayfalara yönelin.</p>
        </header>
        <div class="quick-actions">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to">
            {{ link.title }} <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
        <footer>
          <RouterLink :to="{ name: 'knowledge-base' }" class="card-link">Zimmet prosedürlerini aç</RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="inventory-log">
        <header>
          <h2 id="inventory-log">Giriş / Çıkış Kayıtları</h2>
          <p>Envanterdeki değişikliklerin kronolojisi ve ilgili bağlantılar.</p>
        </header>
        <ul class="timeline">
          <li v-for="entry in movementLog" :key="entry.id" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">{{ entry.text }}</p>
              <p class="timeline-meta">{{ entry.time }}</p>
              <RouterLink v-if="entry.relatedRoute" :to="entry.relatedRoute" class="timeline-link">
                Detaya git
              </RouterLink>
            </div>
          </li>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Zimmet Döngüsü</h2>
      <ol class="workflow-steps">
        <li>
          Stoktan gelen cihazlar zimmetlenmeden önce <RouterLink :to="{ name: 'request-tracking' }">Talep</RouterLink>
          onaylarına bağlanır.
        </li>
        <li>
          Lisans ve yazıcı eşleştirmeleri tamamlandığında
          <RouterLink :to="{ name: 'license-tracking' }">Lisans</RouterLink> ve
          <RouterLink :to="{ name: 'printer-tracking' }">Yazıcı</RouterLink> modülleri bilgilendirilir.
        </li>
        <li>
          Tüm hareketler <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> paneline aktarılır ve
          ekiplerle paylaşılır.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const statusLabels = {
  assigned: 'Zimmetli',
  pending: 'Atama Bekliyor',
  maintenance: 'Bakımda'
} as const;

type InventoryStatus = keyof typeof statusLabels;

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface InventoryItem {
  assetId: string;
  name: string;
  department: string;
  status: InventoryStatus;
  updatedAt: string;
}

interface RelatedLink {
  title: string;
  to: RouteLocationRaw;
}

interface MovementLogEntry {
  id: number;
  time: string;
  text: string;
  relatedRoute?: RouteLocationRaw;
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

const heroMetrics = computed<HeroMetric[]>(() => {
  const assigned = inventoryItems.filter((item) => item.status === 'assigned').length;
  const pending = inventoryItems.filter((item) => item.status === 'pending').length;
  const maintenance = inventoryItems.filter((item) => item.status === 'maintenance').length;

  return [
    { id: 'total', label: 'Toplam Kayıt', value: String(inventoryItems.length), note: 'Aktif envanter kartı' },
    { id: 'assigned', label: 'Zimmetli', value: String(assigned), note: 'Teslim edilmiş cihaz' },
    { id: 'pending', label: 'Atama Bekliyor', value: String(pending), note: 'Zimmet planı bekleyen' },
    { id: 'maintenance', label: 'Bakımda', value: String(maintenance), note: 'Servis sürecindeki varlık' }
  ];
});

const relatedLinks: RelatedLink[] = [
  { title: 'Stok Takip', to: { name: 'stock-tracking' } },
  { title: 'Lisans Takip', to: { name: 'license-tracking' } },
  { title: 'Yazıcı Takip', to: { name: 'printer-tracking' } }
];

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

<style scoped src="@/styles/workspace.css"></style>
