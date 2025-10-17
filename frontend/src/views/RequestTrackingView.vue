<template>
  <section class="workspace-page" aria-labelledby="request-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Operasyon Merkezi</span>
          <h1 id="request-title">Talep Takip</h1>
          <p class="hero-intro">
            Envanter, lisans ve destek ihtiyaçları için açılan talepleri uçtan uca yönetin. Durumlara
            göre iş akışlarını takip ederek onaylanan ürünleri envantere aktarın, iptal edilenleri ise
            kayıt altına alarak süreci şeffaflaştırın.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'stock-tracking' }" class="primary-action">Stok rezervasyonlarını aç</RouterLink>
          <RouterLink :to="{ name: 'records' }" class="secondary-link">Denetim kayıtlarını incele</RouterLink>
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

    <div class="workspace-grid columns-2 request-grid">
      <article
        v-for="column in requestColumns"
        :key="column.id"
        class="workspace-card status-card"
        :style="{ '--status-accent': column.accent }"
      >
        <header class="status-header">
          <div>
            <h2>{{ column.title }}</h2>
            <p>{{ column.description }}</p>
          </div>
          <span class="status-counter">{{ column.items.length }}</span>
        </header>
        <ul class="status-list">
          <li v-for="item in column.items" :key="item.id">
            <p class="status-title">{{ item.title }}</p>
            <p class="status-meta">
              <span>{{ item.requester }}</span>
              <span aria-hidden="true">•</span>
              <span>{{ item.product }}</span>
            </p>
            <p class="status-note">{{ item.statusNote }}</p>
            <div class="status-actions">
              <span class="status-tag">{{ item.updatedAt }}</span>
              <RouterLink :to="{ name: item.targetRoute }" class="card-link">
                {{ item.targetLabel }}
              </RouterLink>
            </div>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: column.footerRoute }" class="footer-link">
            {{ column.footerLabel }}
          </RouterLink>
          <p class="summary-note">{{ column.footerNote }}</p>
        </footer>
      </article>

      <article class="workspace-card wide" aria-labelledby="followups-title">
        <header>
          <h2 id="followups-title">İlgili İşlemler</h2>
          <p>Talep akışını destekleyen modüllere hızlı geçiş yapın.</p>
        </header>
        <div class="quick-actions">
          <RouterLink :to="{ name: 'inventory-tracking' }">
            Teslim edilen ürünleri kaydet <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink :to="{ name: 'scrap-management' }">
            Hurda değerlendirmelerini gözden geçir <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink :to="{ name: 'knowledge-base' }">
            Talep onay rehberini aç <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Operasyon Akışı</h2>
      <ol class="workflow-steps">
        <li>
          Talep açılır ve durum <strong>Bekleyen</strong> olarak kaydedilir. İlgili stoklar için
          <RouterLink :to="{ name: 'stock-tracking' }">Stok Takip</RouterLink> modülünden rezervasyon
          yapılır.
        </li>
        <li>
          Ürün teslim edildiğinde statü <strong>Karşılandı</strong> olur ve
          <RouterLink :to="{ name: 'inventory-tracking' }">Envanter Takip</RouterLink> modülüne
          otomatik giriş yapılır.
        </li>
        <li>
          Reddedilen veya iptal edilen talepler <strong>İptal</strong> kolonuna taşınır ve
          <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> bölümünde loglanır.
        </li>
      </ol>
      <div class="chip-group">
        <RouterLink :to="{ name: 'admin-panel' }" class="primary-action">Onay kurallarını düzenle</RouterLink>
        <RouterLink :to="{ name: 'profile' }" class="secondary-link">Onaycı listeni kontrol et</RouterLink>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

type RequestStatus = 'pending' | 'delivered' | 'cancelled';

type RouteName =
  | 'stock-tracking'
  | 'license-tracking'
  | 'inventory-tracking'
  | 'printer-tracking'
  | 'records'
  | 'scrap-management'
  | 'admin-panel'
  | 'knowledge-base'
  | 'profile';

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface RequestItem {
  id: string;
  title: string;
  requester: string;
  product: string;
  status: RequestStatus;
  updatedAt: string;
  statusNote: string;
  targetRoute: RouteName;
  targetLabel: string;
}

interface BaseColumn {
  id: RequestStatus;
  title: string;
  description: string;
  accent: string;
  footerLabel: string;
  footerRoute: RouteName;
  footerNote: string;
}

const requests: RequestItem[] = [
  {
    id: 'RQ-1045',
    title: 'Yeni dizüstü bilgisayar talebi',
    requester: 'Ayşe Yılmaz',
    product: 'Dell Latitude 5440',
    status: 'pending',
    updatedAt: '11.03.2024',
    statusNote: 'Tedarik biriminden stok teyidi bekleniyor.',
    targetRoute: 'stock-tracking',
    targetLabel: 'Stok kontrolüne git'
  },
  {
    id: 'RQ-1046',
    title: 'Adobe lisans yenilemesi',
    requester: 'Kerem Durmaz',
    product: 'Adobe Creative Cloud',
    status: 'pending',
    updatedAt: '12.03.2024',
    statusNote: 'Finans onayı son aşamada.',
    targetRoute: 'license-tracking',
    targetLabel: 'Lisans kaydını aç'
  },
  {
    id: 'RQ-1041',
    title: 'Çağrı merkezi kulaklığı değişimi',
    requester: 'Elif Ak',
    product: 'Jabra Evolve 65',
    status: 'delivered',
    updatedAt: '08.03.2024',
    statusNote: 'Teslim edildi, envanterde kayıt oluşturuldu.',
    targetRoute: 'inventory-tracking',
    targetLabel: 'Envanter kartını gör'
  },
  {
    id: 'RQ-1033',
    title: 'Yazıcı toner siparişi',
    requester: 'Operasyon Ekibi',
    product: 'HP 410X Toner Seti',
    status: 'delivered',
    updatedAt: '06.03.2024',
    statusNote: 'Teslim edildi, yazıcı stokları güncellendi.',
    targetRoute: 'printer-tracking',
    targetLabel: 'Yazıcı kaydını aç'
  },
  {
    id: 'RQ-1027',
    title: 'ERP erişim talebi',
    requester: 'Mert Çelik',
    product: 'SAP Kullanıcı Yetkisi',
    status: 'cancelled',
    updatedAt: '04.03.2024',
    statusNote: 'Talep sahibi tarafından iptal edildi.',
    targetRoute: 'records',
    targetLabel: 'Log kaydını görüntüle'
  },
  {
    id: 'RQ-1019',
    title: 'Arızalı yazıcı hurdaya çıkarma',
    requester: 'Destek Ekibi',
    product: 'Canon iR-ADV DX 4745i',
    status: 'cancelled',
    updatedAt: '01.03.2024',
    statusNote: 'Hurda komitesi kararı bekleniyor, kayıtlar güncellendi.',
    targetRoute: 'scrap-management',
    targetLabel: 'Hurda listesini kontrol et'
  }
];

const baseColumns: BaseColumn[] = [
  {
    id: 'pending',
    title: 'Bekleyen Talepler',
    description: 'Onay ve stok kontrolü sürecindeki talepler.',
    accent: '#f59e0b',
    footerLabel: 'Stok ve finans kontrollerine git',
    footerRoute: 'stock-tracking',
    footerNote: 'Taleplerin karşılanması için stok rezervasyonlarını yönetin.'
  },
  {
    id: 'delivered',
    title: 'Karşılanan Talepler',
    description: 'Teslimi yapılan ve envantere işlenen talepler.',
    accent: '#22c55e',
    footerLabel: 'Envanter kayıtlarını görüntüle',
    footerRoute: 'inventory-tracking',
    footerNote: 'Teslim edilen ürünlerin envanter kartlarını inceleyin.'
  },
  {
    id: 'cancelled',
    title: 'İptal / Reddedilen Talepler',
    description: 'İptal edilen veya hurda değerlendirmesi bekleyen talepler.',
    accent: '#ef4444',
    footerLabel: 'Hurda listesini kontrol et',
    footerRoute: 'scrap-management',
    footerNote: 'İptal gerekçeleri için kayıtlar modülünü incelemeyi unutmayın.'
  }
];

const requestColumns = computed(() =>
  baseColumns.map((column) => ({
    ...column,
    items: requests.filter((request) => request.status === column.id)
  }))
);

const totalRequests = computed(() => requests.length);

const heroMetrics = computed<HeroMetric[]>(() => {
  const pendingCount = requestColumns.value.find((column) => column.id === 'pending')?.items.length ?? 0;
  const deliveredCount = requestColumns.value.find((column) => column.id === 'delivered')?.items.length ?? 0;
  const cancelledCount = requestColumns.value.find((column) => column.id === 'cancelled')?.items.length ?? 0;

  return [
    { id: 'total', label: 'Toplam Talep', value: String(totalRequests.value), note: 'Aktif kayıt sayısı' },
    { id: 'pending', label: 'Bekleyen', value: String(pendingCount), note: 'Onay bekleyen talep' },
    { id: 'delivered', label: 'Karşılanan', value: String(deliveredCount), note: 'Teslim edilip envantere işlenen' },
    { id: 'cancelled', label: 'İptal', value: String(cancelledCount), note: 'Hurda veya iptal edilen' }
  ];
});
</script>

<style scoped src="@/styles/workspace.css"></style>
