<template>
  <section class="workspace-page" aria-labelledby="scrap-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Hurda Merkezi</span>
          <h1 id="scrap-title">Hurdalar</h1>
          <p class="hero-intro">
            Yazıcılar ve envanterdeki varlıkların hurdaya ayrılma sürecini planlayın. Değerleme,
            onaylama ve imha adımlarını kayıt altında tutarak envanter döngüsünü tamamlayın.
          </p>
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
      <article class="workspace-card table-card" aria-labelledby="evaluation-title">
        <header>
          <h2 id="evaluation-title">Değerlendirmede Olanlar</h2>
          <p>Hurdaya ayrılmak üzere bekleyen ekipmanların inceleme durumu.</p>
        </header>
        <table>
          <thead>
            <tr>
              <th scope="col">Varlık</th>
              <th scope="col">Durum</th>
              <th scope="col">Talep</th>
              <th scope="col">Son Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isEvaluationLoading">
              <td colspan="4" class="empty-state">Hurda değerlendirmeleri yükleniyor...</td>
            </tr>
            <tr v-else-if="evaluationItems.length === 0">
              <td colspan="4" class="empty-state">Değerlendirme bekleyen hurda bulunmuyor.</td>
            </tr>
            <tr v-else v-for="item in evaluationItems" :key="item.id">
              <td>
                <span class="summary-title">{{ item.asset }}</span>
                <p class="summary-meta">{{ item.tag }}</p>
              </td>
              <td>{{ item.status }}</td>
              <td>
                <span class="table-link">{{ item.requestId }}</span>
              </td>
              <td>{{ item.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </article>

      <article class="workspace-card" aria-labelledby="completed-title">
        <header>
          <h2 id="completed-title">Hurdaya Ayrılmış Envanter</h2>
          <p>Onaylanmış ve imha planı oluşturulmuş varlıklar.</p>
        </header>
        <ul class="status-list">
          <li v-if="isCompletedLoading" class="empty-state">Tamamlanan hurda kayıtları yükleniyor...</li>
          <li v-else-if="completedItems.length === 0" class="empty-state">Henüz tamamlanan hurda kaydı yok.</li>
          <li v-else v-for="record in completedItems" :key="record.id">
            <p class="status-title">{{ record.asset }}</p>
            <p class="status-meta">{{ record.serial }} • {{ record.location }}</p>
            <p class="status-note">{{ record.note }}</p>
            <p class="card-link muted">{{ record.relatedLabel }}</p>
          </li>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Hurda Süreci Adımları</h2>
      <ol class="workflow-steps">
        <li>
          Talep modülünden gelen hurda isteği teknik değerlendirmeden geçer ve değer kaybı raporu
          hazırlanır.
        </li>
        <li>Onaylanan cihazlar için yetkili imzalar toplanır.</li>
        <li>İmha edilen ekipmanlar raporlanır ve ilgili ekiplerle paylaşılır.</li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  fetchScrapCompleted,
  fetchScrapEvaluation,
  type ScrapCompletedEntity,
  type ScrapEvaluationEntity
} from '@/services/modules';

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface EvaluationItem {
  id: string;
  asset: string;
  tag: string;
  status: string;
  requestId: string;
  updatedAt: string;
}

interface CompletedItem {
  id: string;
  asset: string;
  serial: string;
  location: string;
  note: string;
  relatedLabel: string;
}

const evaluationItems = ref<EvaluationItem[]>([]);
const completedItems = ref<CompletedItem[]>([]);
const isEvaluationLoading = ref(true);
const isCompletedLoading = ref(true);

const mapEvaluationEntity = (entity: ScrapEvaluationEntity): EvaluationItem => ({
  id: entity.id,
  asset: entity.asset,
  tag: entity.tag,
  status: entity.status,
  requestId: entity.requestId,
  updatedAt: entity.updatedAt
});

const mapCompletedEntity = (entity: ScrapCompletedEntity): CompletedItem => ({
  id: entity.id,
  asset: entity.asset,
  serial: entity.serial,
  location: entity.location,
  note: entity.note,
  relatedLabel: entity.relatedLabel
});

const loadScrapData = async () => {
  try {
    const [evaluation, completed] = await Promise.all([
      fetchScrapEvaluation(),
      fetchScrapCompleted()
    ]);

    evaluationItems.value = evaluation.map(mapEvaluationEntity);
    completedItems.value = completed.map(mapCompletedEntity);
  } catch (error) {
    console.error('Hurda kayıtları yüklenirken hata oluştu.', error);
  } finally {
    isEvaluationLoading.value = false;
    isCompletedLoading.value = false;
  }
};

onMounted(() => {
  void loadScrapData();
});

const heroMetrics = computed<HeroMetric[]>(() => {
  const financePending = evaluationItems.value.filter((item) => item.status.includes('Finans')).length;

  return [
    {
      id: 'queue',
      label: 'Bekleyen İnceleme',
      value: String(evaluationItems.value.length),
      note: 'Teknik rapor sürecinde'
    },
    {
      id: 'completed',
      label: 'Tamamlanan',
      value: String(completedItems.value.length),
      note: 'İmha planı oluşturuldu'
    },
    { id: 'finance', label: 'Finans Onayı', value: String(financePending), note: 'Bekleyen ödeme kontrolü' }
  ];
});
</script>

<style scoped src="@/styles/workspace.css"></style>

<style scoped>
.empty-state {
  text-align: center;
  padding: 1.25rem;
  color: #475569;
  font-weight: 500;
}
</style>
