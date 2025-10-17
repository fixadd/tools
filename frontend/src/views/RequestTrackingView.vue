<template>
  <section class="page-section" aria-labelledby="request-title">
    <header class="page-header">
      <div>
        <h1 id="request-title">Talep Takip</h1>
        <p class="page-intro">
          Envanter, lisans ve destek ihtiyaçları için açılan talepleri uçtan uca yönetin. Durumlara
          göre iş akışlarını takip ederek onaylanan ürünleri envantere aktarın, iptal edilenleri ise
          kayıt altına alarak süreci şeffaflaştırın.
        </p>
      </div>

      <div class="status-summary" role="list">
        <article
          v-for="summary in statusSummary"
          :key="summary.id"
          class="summary-card"
          role="listitem"
        >
          <span class="summary-label">{{ summary.title }}</span>
          <p class="summary-count">{{ summary.count }}</p>
          <span class="summary-caption">{{ totalRequests }} toplam talebin içinde</span>
        </article>
      </div>
    </header>

    <div class="status-board" role="list">
      <article
        v-for="column in requestColumns"
        :key="column.id"
        class="status-column"
        role="listitem"
        :style="{ '--column-accent': column.accent }"
      >
        <header class="column-header">
          <div>
            <h2>{{ column.title }}</h2>
            <p>{{ column.description }}</p>
          </div>
          <span class="column-badge">{{ column.items.length }}</span>
        </header>

        <ul class="request-list">
          <li v-for="item in column.items" :key="item.id" class="request-item">
            <div class="request-meta">
              <p class="request-title">{{ item.title }}</p>
              <p class="request-details">
                <span>{{ item.requester }}</span>
                <span aria-hidden="true">•</span>
                <span>{{ item.product }}</span>
              </p>
              <p class="request-note">{{ item.statusNote }}</p>
            </div>
            <div class="request-actions">
              <span class="request-tag">{{ item.updatedAt }}</span>
              <RouterLink :to="{ name: item.targetRoute }" class="request-link">
                {{ item.targetLabel }}
              </RouterLink>
            </div>
          </li>
        </ul>

        <footer class="column-footer">
          <RouterLink :to="{ name: column.footerRoute }" class="footer-link">
            {{ column.footerLabel }}
          </RouterLink>
          <p class="footer-note">{{ column.footerNote }}</p>
        </footer>
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

      <div class="workflow-actions">
        <RouterLink :to="{ name: 'knowledge-base' }" class="workflow-link">
          İlgili dokümanları aç
        </RouterLink>
        <RouterLink :to="{ name: 'admin-panel' }" class="workflow-link">
          Onay kurallarını düzenle
        </RouterLink>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

type RequestStatus = 'pending' | 'delivered' | 'cancelled';

interface RequestItem {
  id: string;
  title: string;
  requester: string;
  product: string;
  status: RequestStatus;
  updatedAt: string;
  statusNote: string;
  targetRoute: string;
  targetLabel: string;
}

interface BaseColumn {
  id: RequestStatus;
  title: string;
  description: string;
  accent: string;
  footerLabel: string;
  footerRoute: string;
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

const statusSummary = computed(() =>
  requestColumns.value.map((column) => ({
    id: column.id,
    title: column.title,
    count: column.items.length
  }))
);

const totalRequests = computed(() => requests.length);
</script>

<style scoped>
.page-section {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.page-header {
  display: grid;
  gap: 1.75rem;
}

.page-header h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

.page-intro {
  margin: 0;
  max-width: 760px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.status-summary {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.summary-card {
  padding: 1.5rem;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #64748b;
}

.summary-count {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.summary-caption {
  font-size: 0.85rem;
  color: #94a3b8;
}

.status-board {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.status-column {
  position: relative;
  display: grid;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  overflow: hidden;
}

.status-column::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 22px;
  border: 2px solid var(--column-accent);
  opacity: 0.1;
  pointer-events: none;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.column-header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
}

.column-header p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.column-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--column-accent);
  background: rgba(148, 163, 184, 0.15);
}

.request-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.request-item {
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  display: grid;
  gap: 0.75rem;
  background: rgba(241, 245, 249, 0.45);
}

.request-meta {
  display: grid;
  gap: 0.35rem;
}

.request-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.request-details {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #64748b;
}

.request-note {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.request-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.request-tag {
  font-size: 0.85rem;
  color: #64748b;
  background: rgba(148, 163, 184, 0.2);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
}

.request-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2563eb;
}

.column-footer {
  display: grid;
  gap: 0.35rem;
}

.footer-link {
  color: #0f172a;
  font-weight: 600;
}

.footer-note {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}

.workflow-card {
  padding: 2.5rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.08));
  border: 1px solid rgba(37, 99, 235, 0.15);
  box-shadow: 0 25px 45px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1.5rem;
}

.workflow-card h2 {
  margin: 0;
  font-size: 1.45rem;
}

.workflow-steps {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.75rem;
  color: #1e293b;
  line-height: 1.6;
}

.workflow-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.workflow-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  border-radius: 999px;
  background: #1d4ed8;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
}

.workflow-link:hover {
  background: #1e3a8a;
}

@media (max-width: 960px) {
  .request-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .workflow-card {
    padding: 2rem;
  }
}
</style>
