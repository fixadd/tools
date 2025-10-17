<template>
  <section class="workspace-page" aria-labelledby="records-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Denetim Merkezi</span>
          <h1 id="records-title">Kayıtlar</h1>
          <p class="hero-intro">
            Sistem genelinde yapılan ekleme, silme ve güncelleme işlemlerini tek panelde takip edin.
            Modüller arası bağlantılar sayesinde hangi kaynağın hangi etkiyi oluşturduğunu görün.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'knowledge-base' }" class="primary-action">
            Denetim rehberini aç
          </RouterLink>
          <RouterLink :to="{ name: 'admin-panel' }" class="secondary-link">Admin hareketlerine git</RouterLink>
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
      <article class="workspace-card" aria-labelledby="timeline-title">
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

      <article class="workspace-card" aria-labelledby="insight-title">
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
        <footer>
          <RouterLink :to="{ name: 'scrap-management' }" class="card-link">
            Hurda raporlarını karşılaştır
          </RouterLink>
        </footer>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Denetim Akışı</h2>
      <ol class="workflow-steps">
        <li>
          Talep, hurda veya admin modüllerinde yapılan değişiklikler otomatik olarak kayıt altına
          alınır ve <RouterLink :to="{ name: 'inventory-tracking' }">Envanter</RouterLink> modülüne
          aktarılır.
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

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
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

const heroMetrics: HeroMetric[] = [
  { id: 'week', label: 'Bu Hafta', value: '68', note: 'Loglanan işlem sayısı' },
  { id: 'alerts', label: 'Uyarılar', value: '5', note: 'İncelenmesi gereken kayıt' },
  { id: 'exports', label: 'Paylaşımlar', value: '3', note: 'Dışa aktarılan rapor' }
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

<style scoped src="@/styles/workspace.css"></style>
