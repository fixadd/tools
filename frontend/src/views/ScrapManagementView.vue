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
        <div class="hero-actions">
          <RouterLink :to="{ name: 'request-tracking' }" class="primary-action">Talep akışına dön</RouterLink>
          <RouterLink :to="{ name: 'records' }" class="secondary-link">Hurda loglarını aç</RouterLink>
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
            <tr v-for="item in evaluationItems" :key="item.id">
              <td>
                <span class="summary-title">{{ item.asset }}</span>
                <p class="summary-meta">{{ item.tag }}</p>
              </td>
              <td>{{ item.status }}</td>
              <td>
                <RouterLink :to="{ name: 'request-tracking' }" class="table-link">
                  {{ item.requestId }}
                </RouterLink>
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
          <li v-for="record in completedItems" :key="record.id">
            <p class="status-title">{{ record.asset }}</p>
            <p class="status-meta">{{ record.serial }} • {{ record.location }}</p>
            <p class="status-note">{{ record.note }}</p>
            <RouterLink :to="{ name: record.relatedRoute }" class="card-link">
              {{ record.relatedLabel }}
            </RouterLink>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'inventory-tracking' }" class="card-link">
            Envanterdeki karşılıkları kontrol et
          </RouterLink>
        </footer>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Hurda Süreci Adımları</h2>
      <ol class="workflow-steps">
        <li>
          Talep modülünden gelen hurda isteği teknik değerlendirmeden geçer ve değer kaybı raporu
          hazırlanır.
        </li>
        <li>
          Onaylanan cihazlar için <RouterLink :to="{ name: 'admin-panel' }">Admin Paneli</RouterLink>
          üzerinden yetkili imzalar toplanır.
        </li>
        <li>
          İmha edilen ekipmanlar <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> modülüne
          aktarılır ve finans birimine raporlanır.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

type RouteName = 'printer-tracking' | 'inventory-tracking' | 'scrap-management' | 'records';

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
  relatedRoute: RouteName;
  relatedLabel: string;
}

const evaluationItems: EvaluationItem[] = [
  {
    id: '1',
    asset: 'Canon iR-ADV DX 4745i Yazıcı',
    tag: 'PRN-00213',
    status: 'Teknik inceleme bekleniyor',
    requestId: 'RQ-1019',
    updatedAt: '11.03.2024'
  },
  {
    id: '2',
    asset: 'Dell OptiPlex 7080 SFF',
    tag: 'INV-00874',
    status: 'Finans onayı aşamasında',
    requestId: 'RQ-1008',
    updatedAt: '10.03.2024'
  }
];

const completedItems: CompletedItem[] = [
  {
    id: '1',
    asset: 'HP LaserJet Pro M404dn',
    serial: 'CNBXJ1F035',
    location: 'Merkez depo',
    note: 'Yedek parça olarak ayrıldı, toner deposu aktarıldı.',
    relatedRoute: 'printer-tracking',
    relatedLabel: 'Yazıcı kaydını incele'
  },
  {
    id: '2',
    asset: 'Lenovo ThinkPad T490',
    serial: 'PF1ABCD23',
    location: 'Hurda deposu',
    note: 'Parola sıfırlama başarısız, disk imhası tamamlandı.',
    relatedRoute: 'inventory-tracking',
    relatedLabel: 'Envanter geçmişini aç'
  }
];

const heroMetrics = computed<HeroMetric[]>(() => {
  const financePending = evaluationItems.filter((item) => item.status.includes('Finans')).length;

  return [
    { id: 'queue', label: 'Bekleyen İnceleme', value: String(evaluationItems.length), note: 'Teknik rapor sürecinde' },
    { id: 'completed', label: 'Tamamlanan', value: String(completedItems.length), note: 'İmha planı oluşturuldu' },
    { id: 'finance', label: 'Finans Onayı', value: String(financePending), note: 'Bekleyen ödeme kontrolü' }
  ];
});
</script>

<style scoped src="@/styles/workspace.css"></style>
