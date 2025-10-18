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
        <template v-if="isMetricsLoading">
          <div class="metric-placeholder">Metrikler yükleniyor...</div>
        </template>
        <template v-else-if="heroMetrics.length === 0">
          <div class="metric-placeholder">Henüz metrik oluşturulmadı.</div>
        </template>
        <template v-else>
          <div v-for="metric in heroMetrics" :key="metric.id">
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
            <p class="metric-note">{{ metric.note }}</p>
          </div>
        </template>
      </dl>
    </article>

    <div class="workspace-grid columns-2">
      <article class="workspace-card" aria-labelledby="timeline-title">
        <header>
          <h2 id="timeline-title">Son İşlemler</h2>
          <p>Modüllerde gerçekleşen önemli hareketler kronolojik olarak listelenir.</p>
        </header>
        <ul class="timeline">
          <li v-if="isLogsLoading" class="timeline-entry placeholder">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">Kayıtlar yükleniyor...</p>
              <p class="timeline-meta">Lütfen bekleyin</p>
            </div>
          </li>
          <li v-else-if="logs.length === 0" class="timeline-entry placeholder">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">Henüz işlem kaydı bulunmuyor.</p>
              <p class="timeline-meta">Yeni işlemler burada görünecek.</p>
            </div>
          </li>
          <template v-else>
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
          </template>
        </ul>
      </article>

      <article class="workspace-card" aria-labelledby="insight-title">
        <header>
          <h2 id="insight-title">Öne Çıkan Kayıtlar</h2>
          <p>Operasyon ekipleri için dikkat edilmesi gereken değişikliklerin özeti.</p>
        </header>
        <ul class="insight-list">
          <li v-if="isInsightsLoading" class="insight-empty">Öne çıkan kayıtlar yükleniyor...</li>
          <li v-else-if="insights.length === 0" class="insight-empty">Henüz öne çıkan kayıt bulunmuyor.</li>
          <li v-else v-for="insight in insights" :key="insight.id">
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
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import {
  fetchAuditInsights,
  fetchAuditLogs,
  fetchAuditMetrics,
  type AuditInsightEntity,
  type AuditLogEntity,
  type AuditMetricEntity
} from '@/services/modules';

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

const heroMetrics = ref<HeroMetric[]>([]);
const logs = ref<LogEntry[]>([]);
const insights = ref<InsightItem[]>([]);
const isMetricsLoading = ref(true);
const isLogsLoading = ref(true);
const isInsightsLoading = ref(true);

const mapMetricEntity = (entity: AuditMetricEntity): HeroMetric => ({
  id: entity.id,
  label: entity.label,
  value: entity.value,
  note: entity.note
});

const mapLogEntity = (entity: AuditLogEntity): LogEntry => ({
  id: String(entity.id),
  title: entity.title,
  detail: entity.detail,
  time: entity.eventTime,
  actor: entity.actor,
  routeName: entity.routeName as RouteName,
  linkLabel: entity.linkLabel
});

const mapInsightEntity = (entity: AuditInsightEntity): InsightItem => ({
  id: String(entity.id),
  title: entity.title,
  note: entity.note,
  routeName: entity.routeName as RouteName,
  linkLabel: entity.linkLabel
});

const loadAuditData = async () => {
  try {
    const [metricsData, logsData, insightsData] = await Promise.all([
      fetchAuditMetrics(),
      fetchAuditLogs(),
      fetchAuditInsights()
    ]);

    heroMetrics.value = metricsData.map(mapMetricEntity);
    logs.value = logsData.map(mapLogEntity);
    insights.value = insightsData.map(mapInsightEntity);
  } catch (error) {
    console.error('Kayıt verileri yüklenirken hata oluştu.', error);
  } finally {
    isMetricsLoading.value = false;
    isLogsLoading.value = false;
    isInsightsLoading.value = false;
  }
};

onMounted(() => {
  void loadAuditData();
});
</script>

<style scoped src="@/styles/workspace.css"></style>

<style scoped>
.metric-placeholder {
  display: grid;
  place-items: center;
  min-height: 80px;
  color: #475569;
  font-weight: 500;
}

.timeline-entry.placeholder {
  opacity: 0.7;
}

.insight-empty {
  text-align: center;
  padding: 1rem 0;
  color: #64748b;
  font-weight: 500;
}
</style>
