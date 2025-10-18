<template>
  <section class="workspace-page" aria-labelledby="printer-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Destek Merkezi</span>
          <h1 id="printer-title">Yazıcı Takip</h1>
          <p class="hero-intro">
            Şirket yazıcılarının durumunu tek ekranda görün. Sarf malzeme seviyeleri, arıza kayıtları ve
            talep süreçleri ile tüm cihazların aktif durumunu yönetin.
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
      <article class="workspace-card table-card" aria-labelledby="printer-overview">
        <header>
          <h2 id="printer-overview">Cihaz Durum Özeti</h2>
          <p>Lokasyon bazında yazıcıların sarf durumunu ve servis ihtiyaçlarını izleyin.</p>
        </header>
        <table>
          <thead>
            <tr>
              <th scope="col">Cihaz</th>
              <th scope="col">Lokasyon</th>
              <th scope="col">Sarf Seviyesi</th>
              <th scope="col">Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isPrinterLoading">
              <td colspan="4" class="empty-state">Yazıcı verileri yükleniyor...</td>
            </tr>
            <tr v-else-if="printers.length === 0">
              <td colspan="4" class="empty-state">Henüz kayıtlı yazıcı bulunmuyor.</td>
            </tr>
            <template v-else>
              <tr v-for="printer in printers" :key="printer.assetId">
                <td>
                  <span class="summary-title">{{ printer.name }}</span>
                  <p class="summary-meta">{{ printer.assetId }}</p>
                </td>
                <td>{{ printer.location }}</td>
                <td>{{ printer.supply }}</td>
                <td>
                  <span class="status-chip">{{ statusLabels[printer.status] }}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </article>

      <article class="workspace-card" aria-labelledby="printer-links">
        <header>
          <h2 id="printer-links">Entegrasyonlar</h2>
          <p>Yazıcı süreçlerini destekleyen modüllere hızlı geçiş yapın.</p>
        </header>
        <ul class="quick-actions">
          <li v-for="link in relatedLinks" :key="link">{{ link }}</li>
        </ul>
        <footer>
          <p class="card-link muted">Bakım rehberleri güncel tutuluyor</p>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="printer-log">
        <header>
          <h2 id="printer-log">Servis ve Sarf Kayıtları</h2>
          <p>Bakım ve sarf taleplerinin tarihçesi.</p>
        </header>
        <ul class="timeline">
          <li v-if="isPrinterLogLoading" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">Servis kayıtları yükleniyor...</p>
              <p class="timeline-meta">Lütfen bekleyin</p>
            </div>
          </li>
          <li v-else-if="movementLog.length === 0" class="timeline-entry">
            <span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-content">
              <p class="timeline-title">Henüz servis kaydı oluşturulmadı.</p>
              <p class="timeline-meta">Kayıt eklemek için talep açın.</p>
            </div>
          </li>
          <template v-else>
            <li v-for="entry in movementLog" :key="entry.id" class="timeline-entry">
              <span class="timeline-dot" aria-hidden="true"></span>
              <div class="timeline-content">
                <p class="timeline-title">{{ entry.text }}</p>
                <p class="timeline-meta">{{ entry.time }}</p>
                <span v-if="entry.linkLabel" class="timeline-link muted">{{ entry.linkLabel }}</span>
              </div>
            </li>
          </template>
        </ul>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Yazıcı Operasyon Akışı</h2>
      <ol class="workflow-steps">
        <li>
          Toner uyarısı geldiğinde ilgili stok kaydı stok takip ekranında güncellenir.
        </li>
        <li>
          Servis talepleri planlanır ve sonuçları kayıt altına alınır.
        </li>
        <li>
          Cihaz değişimleri envanter ve hurda kayıtlarıyla eşleştirilir.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchPrinterLogs, fetchPrinters, type PrinterEntity, type PrinterLogEntity } from '@/services/modules';

const statusLabels = {
  online: 'Çevrimiçi',
  warning: 'Düşük Sarf',
  maintenance: 'Servis Bekliyor'
} as const;

type PrinterStatus = keyof typeof statusLabels;

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface PrinterRow {
  assetId: string;
  name: string;
  location: string;
  supply: string;
  status: PrinterStatus;
}

interface MovementLogEntry {
  id: number;
  time: string;
  text: string;
  linkLabel?: string;
}

const printers = ref<PrinterRow[]>([]);
const movementLog = ref<MovementLogEntry[]>([]);
const isPrinterLoading = ref(true);
const isPrinterLogLoading = ref(true);

const mapPrinterEntity = (entity: PrinterEntity): PrinterRow => ({
  assetId: entity.assetId,
  name: entity.name,
  location: entity.location,
  supply: entity.supply,
  status: entity.status
});

const mapPrinterLogEntity = (entity: PrinterLogEntity): MovementLogEntry => ({
  id: entity.id,
  time: entity.entryTime,
  text: entity.description,
  linkLabel: entity.linkLabel || undefined
});

const loadPrinters = async () => {
  try {
    const records = await fetchPrinters();
    printers.value = records.map(mapPrinterEntity);
  } catch (error) {
    console.error('Yazıcı kayıtları yüklenirken hata oluştu.', error);
  } finally {
    isPrinterLoading.value = false;
  }
};

const loadPrinterLogs = async () => {
  try {
    const logs = await fetchPrinterLogs();
    movementLog.value = logs.map(mapPrinterLogEntity);
  } catch (error) {
    console.error('Yazıcı logları yüklenirken hata oluştu.', error);
  } finally {
    isPrinterLogLoading.value = false;
  }
};

onMounted(() => {
  void loadPrinters();
  void loadPrinterLogs();
});

const heroMetrics = computed<HeroMetric[]>(() => {
  const online = printers.value.filter((printer) => printer.status === 'online').length;
  const warning = printers.value.filter((printer) => printer.status === 'warning').length;
  const maintenance = printers.value.filter((printer) => printer.status === 'maintenance').length;

  return [
    { id: 'total', label: 'Takipteki Cihaz', value: String(printers.value.length), note: 'Aktif yazıcı sayısı' },
    { id: 'online', label: 'Çevrimiçi', value: String(online), note: 'Kullanıma hazır yazıcı' },
    { id: 'warning', label: 'Düşük Sarf', value: String(warning), note: 'Toner seviyesi kritik' },
    { id: 'maintenance', label: 'Servis Bekleyen', value: String(maintenance), note: 'Planlanan bakım' }
  ];
});

const relatedLinks = ['Stok durum özetleri', 'Envanter güncellemeleri', 'Talep kayıtları'];
</script>

<style scoped src="@/styles/workspace.css"></style>

<style scoped>
.empty-state {
  padding: 1.25rem;
  text-align: center;
  color: #475569;
  font-weight: 500;
}
</style>
