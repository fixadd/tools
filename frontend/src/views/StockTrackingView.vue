<template>
  <section class="workspace-page" aria-labelledby="stock-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Depo Merkezi</span>
          <h1 id="stock-title">Stok Takip</h1>
          <p class="hero-intro">
            Talep modülünden gelen cihaz, lisans ve yazıcı ihtiyaçları bu depoda bekler. Onaylanan
            hareketleri ilgili modüllere aktarın, kullanılmayan varlıkları geri alarak stok dengesini
            yönetin.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'request-tracking' }" class="primary-action">Talep kuyruğunu aç</RouterLink>
          <RouterLink :to="{ name: 'inventory-tracking' }" class="secondary-link">Envanter aktarımını takip et</RouterLink>
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
      <article class="workspace-card table-card" aria-labelledby="stock-overview">
        <header>
          <h2 id="stock-overview">Bekleyen Varlıklar</h2>
          <p>Talep kuyruğundan gelen kalemlerin stoktaki son durumunu görüntüleyin.</p>
        </header>
        <table>
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
                <span class="summary-title">{{ item.name }}</span>
                <p class="summary-meta">{{ item.code }}</p>
              </td>
              <td>{{ item.requestOrigin }}</td>
              <td>
                <RouterLink :to="item.targetRoute" class="table-link">{{ item.target }}</RouterLink>
              </td>
              <td>
                <span class="status-chip" :style="{ background: item.statusColor.background, color: item.statusColor.text }">
                  {{ statusLabels[item.status] }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="workspace-card" aria-labelledby="stock-flow">
        <header>
          <h2 id="stock-flow">Akış Şeması</h2>
          <p>Stoktaki kalemlerin hangi modüllere aktarıldığını takip edin.</p>
        </header>
        <ol class="workflow-steps">
          <li>Talep Takip modülünden gelen ihtiyaçlar stokta doğrulama için sıralanır.</li>
          <li>
            Hazır olan varlıklar <RouterLink :to="{ name: 'inventory-tracking' }">Envanter</RouterLink>,
            <RouterLink :to="{ name: 'license-tracking' }">Lisans</RouterLink> ve
            <RouterLink :to="{ name: 'printer-tracking' }">Yazıcı</RouterLink> modüllerine aktarılır.
          </li>
          <li>İade edilen veya boşa çıkan ürünler kontrol sonrası tekrar stok kaydına alınır.</li>
        </ol>
        <div class="quick-actions">
          <RouterLink v-for="link in relatedLinks" :key="link.title" :to="link.to">
            {{ link.title }} <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
        <footer>
          <RouterLink :to="{ name: 'scrap-management' }" class="card-link">Hurdaya ayrılan kalemleri incele</RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="stock-log">
        <header>
          <h2 id="stock-log">Giriş / Çıkış Logu</h2>
          <p>Depodaki hareketler ve bağlantılı kayıtlar.</p>
        </header>
        <ul class="timeline">
          <li v-for="entry in movementLog" :key="entry.id" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">{{ entry.text }}</p>
              <p class="timeline-meta">{{ entry.time }}</p>
              <RouterLink
                v-if="entry.relatedRoute"
                :to="entry.relatedRoute"
                class="timeline-link"
              >
                Kaydı aç
              </RouterLink>
            </div>
          </li>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Depo Senkronizasyonu</h2>
      <p>
        Stok hareketleri talep ve envanter modülleriyle eş zamanlı çalışır. Her işlem
        <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> paneline aktarılır ve
        <RouterLink :to="{ name: 'profile' }">profil</RouterLink> yetkilerine göre bildirimler gönderilir.
      </p>
      <ol class="workflow-steps">
        <li>Yeni girişler için stok doğrulaması yapılır ve onay bekleyen taleplere bağlanır.</li>
        <li>Çıkış yapılan ürünler envanter kartlarıyla eşleştirilir ve ilgili ekip bilgilendirilir.</li>
        <li>İadeler ve hurdalar ayrı kuyruğa alınarak sürecin sonunda raporlanır.</li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const statusLabels = {
  awaiting: 'Talep Kontrolü',
  prepared: 'Çıkışa Hazır',
  'in-progress': 'Aktarım Yapılıyor',
  returned: 'İadeden Geldi'
} as const;

type StockStatus = keyof typeof statusLabels;

interface StatusColor {
  background: string;
  text: string;
}

interface StockItem {
  id: number;
  name: string;
  code: string;
  requestOrigin: string;
  target: string;
  targetRoute: RouteLocationRaw;
  status: StockStatus;
  statusColor: StatusColor;
}

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface RelatedLink {
  title: string;
  description: string;
  to: RouteLocationRaw;
}

interface MovementLogEntry {
  id: number;
  time: string;
  text: string;
  relatedRoute?: RouteLocationRaw;
}

const statusColors: Record<StockStatus, StatusColor> = {
  awaiting: { background: 'rgba(234, 179, 8, 0.15)', text: '#92400e' },
  prepared: { background: 'rgba(34, 197, 94, 0.18)', text: '#166534' },
  'in-progress': { background: 'rgba(59, 130, 246, 0.18)', text: '#1d4ed8' },
  returned: { background: 'rgba(99, 102, 241, 0.18)', text: '#3730a3' }
};

const stockItems: StockItem[] = [
  {
    id: 1,
    name: 'Dell Latitude 7440',
    code: 'NB-1051',
    requestOrigin: 'Talep #458 / İnsan Kaynakları',
    target: 'Envanter Takip',
    targetRoute: { name: 'inventory-tracking' },
    status: 'awaiting',
    statusColor: statusColors.awaiting
  },
  {
    id: 2,
    name: 'Microsoft Visio Professional',
    code: 'LIC-212',
    requestOrigin: 'Talep #461 / Proje Yönetimi',
    target: 'Lisans Takip',
    targetRoute: { name: 'license-tracking' },
    status: 'prepared',
    statusColor: statusColors.prepared
  },
  {
    id: 3,
    name: 'HP LaserJet Pro M428 Toner',
    code: 'STK-TON-98',
    requestOrigin: 'Talep #452 / Satış',
    target: 'Yazıcı Takip',
    targetRoute: { name: 'printer-tracking' },
    status: 'in-progress',
    statusColor: statusColors['in-progress']
  },
  {
    id: 4,
    name: 'Dell Latitude 5410',
    code: 'NB-0992',
    requestOrigin: 'İade / Finans Departmanı',
    target: 'Envanter Takip',
    targetRoute: { name: 'inventory-tracking' },
    status: 'returned',
    statusColor: statusColors.returned
  }
];

const heroMetrics = computed<HeroMetric[]>(() => {
  const awaiting = stockItems.filter((item) => item.status === 'awaiting').length;
  const ready = stockItems.filter((item) => item.status === 'prepared').length;
  const transfers = stockItems.filter((item) => item.status === 'in-progress').length;

  return [
    { id: 'total', label: 'Toplam Kalem', value: String(stockItems.length), note: 'Stoktaki aktif kayıt' },
    { id: 'awaiting', label: 'Kontrol Bekleyen', value: String(awaiting), note: 'Talep kontrol sürecinde' },
    { id: 'prepared', label: 'Çıkışa Hazır', value: String(ready), note: 'Teslimata hazır kalem' },
    { id: 'transfer', label: 'Aktarımda', value: String(transfers), note: 'Modüllere yönlendiriliyor' }
  ];
});

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

<style scoped src="@/styles/workspace.css"></style>
