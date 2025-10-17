<template>
  <section class="workspace-page" aria-labelledby="license-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Yetki Merkezi</span>
          <h1 id="license-title">Lisans Takip</h1>
          <p class="hero-intro">
            Kurumsal lisans envanterinizi sürüm, kullanım hakkı ve yenileme tarihine göre takip edin.
            Envanterdeki cihazlara atanmış anahtarları görün, stoktan gelen yeni kurulum taleplerini
            bekletmeden lisanslayın.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'inventory-tracking' }" class="primary-action">Zimmetleri kontrol et</RouterLink>
          <RouterLink :to="{ name: 'request-tracking' }" class="secondary-link">Talep kuyruğunu aç</RouterLink>
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
      <article class="workspace-card table-card" aria-labelledby="license-overview">
        <header>
          <h2 id="license-overview">Aktif Lisanslar</h2>
          <p>Ataması yapılan veya yenileme sürecinde olan lisans anahtarlarının özeti.</p>
        </header>
        <table>
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
                <span class="summary-title">{{ license.product }}</span>
                <p class="summary-meta">Anahtar: {{ license.key }}</p>
              </td>
              <td>{{ license.assignedTo }}</td>
              <td>
                <span class="status-chip">{{ statusLabels[license.status] }}</span>
              </td>
              <td>{{ license.renewal }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="workspace-card" aria-labelledby="license-actions">
        <header>
          <h2 id="license-actions">Modüller Arası Akış</h2>
          <p>Talep, stok ve envanter süreçleriyle lisans atamalarını senkronize edin.</p>
        </header>
        <div class="quick-actions">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to">
            {{ link.title }} <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
        <footer>
          <RouterLink :to="{ name: 'knowledge-base' }" class="card-link">Lisans politikalarını aç</RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="license-log">
        <header>
          <h2 id="license-log">Lisans Hareketleri</h2>
          <p>Yenileme ve atama değişikliklerinin kronolojisi.</p>
        </header>
        <ul class="timeline">
          <li v-for="entry in movementLog" :key="entry.id" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">{{ entry.text }}</p>
              <p class="timeline-meta">{{ entry.time }}</p>
              <RouterLink v-if="entry.relatedRoute" :to="entry.relatedRoute" class="timeline-link">
                Kayda git
              </RouterLink>
            </div>
          </li>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Lisans Döngüsü</h2>
      <ol class="workflow-steps">
        <li>
          Talep modülünden gelen yazılım isteği onaylandığında stokta ilgili kurulum planlanır ve
          lisans anahtarı rezerve edilir.
        </li>
        <li>
          Kurulum tamamlandığında anahtar envanter kartına bağlanır ve sorumlu ekip bilgilendirilir.
        </li>
        <li>
          Yenileme tarihleri <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> ve
          <RouterLink :to="{ name: 'profile' }">Profil</RouterLink> bildirimleriyle takip edilir.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const statusLabels = {
  active: 'Aktif',
  warning: 'Yenileme Yaklaşıyor',
  available: 'Atama Bekliyor'
} as const;

type LicenseStatus = keyof typeof statusLabels;

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface LicenseRow {
  key: string;
  product: string;
  assignedTo: string;
  status: LicenseStatus;
  renewal: string;
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

const heroMetrics = computed<HeroMetric[]>(() => {
  const active = licenseList.filter((license) => license.status === 'active').length;
  const warning = licenseList.filter((license) => license.status === 'warning').length;
  const available = licenseList.filter((license) => license.status === 'available').length;

  return [
    { id: 'total', label: 'Toplam Lisans', value: String(licenseList.length), note: 'Takip edilen ürün' },
    { id: 'active', label: 'Aktif', value: String(active), note: 'Kullanımda olan lisans' },
    { id: 'warning', label: 'Yenileme Uyarısı', value: String(warning), note: 'Yaklaşan yenileme' },
    { id: 'available', label: 'Bekleyen Atama', value: String(available), note: 'Rezerve anahtar' }
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

<style scoped src="@/styles/workspace.css"></style>
