<template>
  <section class="page-section" aria-labelledby="records-title">
    <header class="page-header">
      <div>
        <h1 id="records-title">Kayıtlar</h1>
        <p class="page-intro">
          Sistem genelinde yapılan ekleme, silme ve güncelleme işlemlerini tek ekrandan takip edin.
          Modüller arası bağlantılar sayesinde hangi kaynağın hangi etkiyi oluşturduğunu görün.
        </p>
      </div>
      <div class="filter-group" role="toolbar" aria-label="Kayıt filtreleri">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="filter-button"
        >
          {{ filter.label }}
        </button>
      </div>
    </header>

    <div class="records-grid">
      <article class="records-card" aria-labelledby="timeline-title">
        <header>
          <h2 id="timeline-title">Son İşlemler</h2>
          <p>Modüllerde gerçekleşen önemli hareketler kronolojik olarak listelenir.</p>
        </header>
        <ul class="timeline">
          <li v-for="entry in logs" :key="entry.id" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">{{ entry.title }}</p>
              <p class="timeline-meta">{{ entry.time }} • {{ entry.actor }}</p>
              <p class="timeline-note">{{ entry.detail }}</p>
              <RouterLink :to="{ name: entry.routeName }" class="timeline-link">
                {{ entry.linkLabel }}
              </RouterLink>
            </div>
          </li>
        </ul>
      </article>

      <article class="records-card" aria-labelledby="insight-title">
        <header>
          <h2 id="insight-title">Öne Çıkan Kayıtlar</h2>
          <p>Operasyon ekipleri için dikkat edilmesi gereken değişikliklerin özeti.</p>
        </header>
        <ul class="insight-list">
          <li v-for="insight in insights" :key="insight.id">
            <div>
              <p class="insight-title">{{ insight.title }}</p>
              <p class="insight-note">{{ insight.note }}</p>
            </div>
            <RouterLink :to="{ name: insight.routeName }" class="insight-link">
              {{ insight.linkLabel }}
            </RouterLink>
          </li>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Denetim Akışı</h2>
      <ol class="workflow-steps">
        <li>
          Talep, hurda veya admin modüllerinde yapılan değişiklikler otomatik olarak kayıt altına
          alınır.
        </li>
        <li>
          Kritik kayıtlar için bilgi bankasında ilgili dokümanlara bağlantı oluşturulur ve ekip
          bilgilendirilir.
        </li>
        <li>
          Denetim sonuçları finans ve insan kaynakları birimleriyle paylaşılmak üzere dışa aktarılır.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type RouteName =
  | 'request-tracking'
  | 'scrap-management'
  | 'admin-panel'
  | 'inventory-tracking'
  | 'knowledge-base';

interface FilterItem {
  id: string;
  label: string;
}

interface LogEntry {
  id: string;
  title: string;
  detail: string;
  time: string;
  actor: string;
  routeName: RouteName;
  linkLabel: string;
}

interface InsightItem {
  id: string;
  title: string;
  note: string;
  routeName: RouteName;
  linkLabel: string;
}

const filters: FilterItem[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'requests', label: 'Talepler' },
  { id: 'scrap', label: 'Hurdalar' },
  { id: 'admin', label: 'Admin İşlemleri' }
];

const logs: LogEntry[] = [
  {
    id: '1',
    title: 'Talep RQ-1041 envantere taşındı',
    detail: 'Dell Latitude 5440 kaydı otomatik olarak envanter kartına işlendi.',
    time: '12.03.2024 11:24',
    actor: 'Selin Yılmaz',
    routeName: 'inventory-tracking',
    linkLabel: 'Envanter hareketini incele'
  },
  {
    id: '2',
    title: 'Hurda isteği için onay verildi',
    detail: 'Canon iR-ADV DX 4745i yazıcı hurda deposuna taşındı.',
    time: '11.03.2024 15:42',
    actor: 'Baran Yıldız',
    routeName: 'scrap-management',
    linkLabel: 'Hurda kaydını görüntüle'
  },
  {
    id: '3',
    title: 'LDAP bağlantı bilgisi güncellendi',
    detail: 'Yeni servis hesabı eklendi ve parola sıfırlandı.',
    time: '10.03.2024 09:15',
    actor: 'IT Operasyonları',
    routeName: 'admin-panel',
    linkLabel: 'Bağlantı ayarını kontrol et'
  }
];

const insights: InsightItem[] = [
  {
    id: '1',
    title: 'Talep onay SLA sınırına yaklaşıyor',
    note: 'Bekleyen 5 talep için stok teyidi yapılmalı.',
    routeName: 'request-tracking',
    linkLabel: 'Bekleyen talepleri aç'
  },
  {
    id: '2',
    title: 'Hurda prosedürü güncellemesi',
    note: 'Yeni imha formu bilgi bankasına eklendi.',
    routeName: 'knowledge-base',
    linkLabel: 'Dokümana git'
  }
];
</script>

<style scoped>
.page-section {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
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

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-button {
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 999px;
  background: #ffffff;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.9rem;
}

.records-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
}

.records-card {
  padding: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  background: #ffffff;
  display: grid;
  gap: 1.5rem;
}

.records-card header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
}

.records-card header p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.timeline {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1.5rem;
}

.timeline-entry {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  position: relative;
}

.timeline-entry::before {
  content: '';
  position: absolute;
  left: 0.38rem;
  top: 0.75rem;
  bottom: -1rem;
  width: 2px;
  background: rgba(148, 163, 184, 0.4);
}

.timeline-entry:last-child::before {
  display: none;
}

.timeline-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #2563eb;
  margin-top: 0.25rem;
}

.timeline-content {
  display: grid;
  gap: 0.35rem;
}

.timeline-title {
  margin: 0;
  font-weight: 600;
}

.timeline-meta {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.timeline-note {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.timeline-link {
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 600;
}

.insight-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.insight-list li {
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(241, 245, 249, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.25);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.insight-title {
  margin: 0 0 0.35rem;
  font-weight: 600;
}

.insight-note {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.insight-link {
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 600;
}

.workflow-card {
  padding: 2.5rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 116, 144, 0.08));
  border: 1px solid rgba(37, 99, 235, 0.15);
  box-shadow: 0 25px 45px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1.25rem;
}

.workflow-card h2 {
  margin: 0;
  font-size: 1.4rem;
}

.workflow-steps {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.75rem;
  color: #1f2937;
  line-height: 1.6;
}

@media (max-width: 960px) {
  .records-grid {
    grid-template-columns: 1fr;
  }

  .timeline-entry::before {
    bottom: -0.5rem;
  }

  .insight-list li {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
