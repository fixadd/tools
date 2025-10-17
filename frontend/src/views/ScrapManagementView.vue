<template>
  <section class="page-section" aria-labelledby="scrap-title">
    <header class="page-header">
      <div>
        <h1 id="scrap-title">Hurdalar</h1>
        <p class="page-intro">
          Yazıcılar ve envanterdeki varlıkların hurdaya ayrılma sürecini planlayın. Değerleme,
          onaylama ve imha adımlarını kayıt altında tutarak envanter döngüsünü tamamlayın.
        </p>
      </div>

      <RouterLink :to="{ name: 'records' }" class="page-link">
        Hurda loglarını aç
      </RouterLink>
    </header>

    <div class="scrap-grid">
      <article class="scrap-card" aria-labelledby="evaluation-title">
        <header>
          <h2 id="evaluation-title">Değerlendirme Aşamasındakiler</h2>
          <p>
            Hurdaya ayrılmak üzere bekleyen ekipmanlar. Talep modülü üzerinden gelen tüm kayıtlar
            teknik ekip tarafından incelenir.
          </p>
        </header>
        <table class="scrap-table">
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
                <span class="asset-name">{{ item.asset }}</span>
                <span class="asset-tag">{{ item.tag }}</span>
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
        <footer>
          <RouterLink :to="{ name: 'request-tracking' }" class="footer-link">
            Talep akışına geri dön
          </RouterLink>
        </footer>
      </article>

      <article class="scrap-card" aria-labelledby="completed-title">
        <header>
          <h2 id="completed-title">Hurdaya Ayrılmış Envanter</h2>
          <p>
            Onaylanmış ve imha planı oluşturulmuş varlıklar. Envanter takibi ile eş zamanlı olarak
            stok düşümü yapılır.
          </p>
        </header>
        <ul class="scrap-list">
          <li v-for="record in completedItems" :key="record.id" class="scrap-list-item">
            <div>
              <p class="list-title">{{ record.asset }}</p>
              <p class="list-meta">{{ record.serial }} • {{ record.location }}</p>
              <p class="list-note">{{ record.note }}</p>
            </div>
            <RouterLink :to="{ name: record.relatedRoute }" class="list-link">
              {{ record.relatedLabel }}
            </RouterLink>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'inventory-tracking' }" class="footer-link">
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
          İmha edilen ekipmanlar <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink>
          modülüne aktarılır ve finans birimine raporlanır.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type RouteName = 'printer-tracking' | 'inventory-tracking' | 'scrap-management' | 'records';

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
  max-width: 720px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.page-link {
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  background: #1f2937;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.scrap-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.scrap-card {
  padding: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  background: #ffffff;
  display: grid;
  gap: 1.5rem;
}

.scrap-card header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.4rem;
}

.scrap-card header p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.scrap-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  color: #1f2937;
}

.scrap-table th,
.scrap-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.scrap-table th {
  color: #475569;
  font-weight: 600;
  background: rgba(226, 232, 240, 0.35);
}

.asset-name {
  display: block;
  font-weight: 600;
}

.asset-tag {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
}

.table-link {
  color: #2563eb;
  font-weight: 600;
}

.scrap-card footer {
  display: flex;
  justify-content: flex-end;
}

.footer-link {
  color: #0f172a;
  font-weight: 600;
}

.scrap-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.scrap-list-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(241, 245, 249, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.list-title {
  margin: 0 0 0.4rem;
  font-weight: 600;
}

.list-meta {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.list-note {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: #475569;
}

.list-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2563eb;
}

.workflow-card {
  padding: 2.5rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(37, 99, 235, 0.08));
  border: 1px solid rgba(16, 185, 129, 0.15);
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

@media (max-width: 720px) {
  .scrap-list-item {
    flex-direction: column;
  }
}
</style>
