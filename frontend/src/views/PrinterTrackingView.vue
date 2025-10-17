<template>
  <section class="workspace-page" aria-labelledby="printer-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Destek Merkezi</span>
          <h1 id="printer-title">Yazıcı Takip</h1>
          <p class="hero-intro">
            Şirket yazıcılarının durumunu tek ekranda görün. Sarf malzeme seviyeleri, arıza kayıtları ve
            talep süreçleri ile tüm cihazların aktif durumunu yönetin.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'stock-tracking' }" class="primary-action">Toner stoklarını aç</RouterLink>
          <RouterLink :to="{ name: 'request-tracking' }" class="secondary-link">Servis taleplerini gör</RouterLink>
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
      <article class="workspace-card table-card" aria-labelledby="printer-overview">
        <header>
          <h2 id="printer-overview">Cihaz Durum Özeti</h2>
          <p>Lokasyon bazında yazıcıların sarf durumunu ve servis ihtiyaçlarını izleyin.</p>
        </header>
        <table>
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
                <span class="summary-title">{{ printer.name }}</span>
                <p class="summary-meta">{{ printer.assetId }}</p>
              </td>
              <td>{{ printer.location }}</td>
              <td>{{ printer.supply }}</td>
              <td>
                <span class="status-chip">{{ statusLabels[printer.status] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="workspace-card" aria-labelledby="printer-links">
        <header>
          <h2 id="printer-links">Entegrasyonlar</h2>
          <p>Yazıcı süreçlerini destekleyen modüllere hızlı geçiş yapın.</p>
        </header>
        <div class="quick-actions">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to">
            {{ link.title }} <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
        <footer>
          <RouterLink :to="{ name: 'knowledge-base' }" class="card-link">Bakım rehberlerini aç</RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="printer-log">
        <header>
          <h2 id="printer-log">Servis ve Sarf Kayıtları</h2>
          <p>Bakım ve sarf taleplerinin tarihçesi.</p>
        </header>
        <ul class="timeline">
          <li v-for="entry in movementLog" :key="entry.id" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">{{ entry.text }}</p>
              <p class="timeline-meta">{{ entry.time }}</p>
              <RouterLink v-if="entry.relatedRoute" :to="entry.relatedRoute" class="timeline-link">
                İşleme git
              </RouterLink>
            </div>
          </li>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Yazıcı Operasyon Akışı</h2>
      <ol class="workflow-steps">
        <li>
          Toner uyarısı geldiğinde ilgili stok kaydı <RouterLink :to="{ name: 'stock-tracking' }">Stok Takip</RouterLink>
          modülünde güncellenir.
        </li>
        <li>
          Servis talepleri <RouterLink :to="{ name: 'request-tracking' }">Talep Takip</RouterLink> üzerinden
          planlanır ve sonuçları <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> modülüne aktarılır.
        </li>
        <li>
          Cihaz değişimleri <RouterLink :to="{ name: 'inventory-tracking' }">Envanter</RouterLink> ve
          <RouterLink :to="{ name: 'scrap-management' }">Hurda</RouterLink> modülleriyle senkronize edilir.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const statusLabels = {
  online: 'Çevrimiçi',
  warning: 'Düşük Sarf',
  maintenance: 'Servis Bekliyor'
} as const;

type PrinterStatus = keyof typeof statusLabels;

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface PrinterRow {
  assetId: string;
  name: string;
  location: string;
  supply: string;
  status: PrinterStatus;
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

const heroMetrics = computed<HeroMetric[]>(() => {
  const online = printers.filter((printer) => printer.status === 'online').length;
  const warning = printers.filter((printer) => printer.status === 'warning').length;
  const maintenance = printers.filter((printer) => printer.status === 'maintenance').length;

  return [
    { id: 'total', label: 'Takipteki Cihaz', value: String(printers.length), note: 'Aktif yazıcı sayısı' },
    { id: 'online', label: 'Çevrimiçi', value: String(online), note: 'Kullanıma hazır yazıcı' },
    { id: 'warning', label: 'Düşük Sarf', value: String(warning), note: 'Toner seviyesi kritik' },
    { id: 'maintenance', label: 'Servis Bekleyen', value: String(maintenance), note: 'Planlanan bakım' }
  ];
});

const relatedLinks: RelatedLink[] = [
  { title: 'Stok Takip', to: { name: 'stock-tracking' } },
  { title: 'Envanter Takip', to: { name: 'inventory-tracking' } },
  { title: 'Talep Takip', to: { name: 'request-tracking' } }
];

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

<style scoped src="@/styles/workspace.css"></style>
