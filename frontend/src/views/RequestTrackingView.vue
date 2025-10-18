<template>
  <section class="request-page" aria-labelledby="request-page-title">
    <header class="page-header">
      <div class="header-copy">
        <span class="page-badge">Talep</span>
        <h1 id="request-page-title">Talepler</h1>
        <p>
          Açık talepleri, tamamlanan teslimatları ve iptal edilen kayıtları bu panelden yönetin. Her durum
          için filtreleyerek ilgili modüllere hızlıca geçiş yapabilirsiniz.
        </p>
      </div>
      <div class="header-actions">
        <button type="button" class="ghost-button" @click="downloadExcel">
          <span aria-hidden="true">⬇️</span>
          Excel
        </button>
        <button type="button" class="primary-button" @click="openRequestForm">
          Talep Aç
        </button>
      </div>
    </header>

    <article class="table-card" aria-labelledby="request-table-title">
      <header class="table-card-header">
        <nav class="status-tabs" aria-label="Talep durum filtreleri">
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            type="button"
            class="tab-button"
            :class="{ active: selectedStatus === tab.id }"
            @click="selectedStatus = tab.id"
          >
            <span>{{ tab.label }}</span>
            <span class="tab-count" aria-hidden="true">{{ tab.count }}</span>
          </button>
        </nav>
        <div class="tab-copy">
          <h2 id="request-table-title">{{ activeTab.title }}</h2>
          <p>{{ activeTab.description }}</p>
        </div>
      </header>

      <div class="table-wrapper" role="region" :aria-label="activeTab.title">
        <table class="request-table">
          <thead>
            <tr>
              <th scope="col">IFS No</th>
              <th scope="col">Donanım Tipi</th>
              <th scope="col">Marka</th>
              <th scope="col">Model</th>
              <th scope="col">Miktar</th>
              <th scope="col">Tarih</th>
              <th scope="col">Açıklama</th>
              <th scope="col" class="table-actions">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in filteredRequests" :key="request.id">
              <td data-title="IFS No">{{ request.ifsNo }}</td>
              <td data-title="Donanım Tipi">{{ request.hardwareType }}</td>
              <td data-title="Marka">{{ request.brand }}</td>
              <td data-title="Model">{{ request.model }}</td>
              <td data-title="Miktar">{{ request.quantity }}</td>
              <td data-title="Tarih">{{ request.date }}</td>
              <td data-title="Açıklama">{{ request.note }}</td>
              <td data-title="İşlemler" class="table-actions">
                <div class="action-group">
                  <button
                    type="button"
                    class="action-button stock"
                    :title="request.targetLabel"
                    @click="handleStockEntry(request)"
                  >
                    Stok Gir
                  </button>
                  <button
                    type="button"
                    class="action-button cancel"
                    @click="cancelRequest(request)"
                  >
                    İptal Et
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredRequests.length === 0">
              <td colspan="8" class="empty-state">{{ activeTab.emptyMessage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
    <transition name="modal-fade">
      <div
        v-if="isRequestFormOpen"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        @click.self="closeRequestForm"
      >
        <form class="modal-dialog" @submit.prevent="submitRequestForm">
          <header class="modal-header">
            <div class="modal-title-group">
              <h2 id="request-modal-title">Talep Aç</h2>
              <p>IFS numarası isteğe bağlıdır. Satır ekleyerek talep detayını oluşturun.</p>
            </div>
            <button type="button" class="icon-button" @click="closeRequestForm">
              <span aria-hidden="true">×</span>
              <span class="sr-only">Talep formunu kapat</span>
            </button>
          </header>

          <div class="modal-body">
            <label class="field-label" for="request-ifs-input">
              IFS No <span class="optional">(opsiyonel)</span>
            </label>
            <input
              id="request-ifs-input"
              v-model.trim="requestForm.ifsNo"
              type="text"
              class="text-input"
              placeholder="IFS-0001"
              autocomplete="off"
            />

            <div class="line-items-toolbar">
              <h3>Kalemler</h3>
              <button type="button" class="link-button" @click="addLineItem">Satır Ekle</button>
            </div>

            <div class="line-items-grid" role="group" aria-label="Talep kalemleri">
              <div class="line-items-head" aria-hidden="true">
                <span>Donanım Tipi</span>
                <span>Miktar</span>
                <span>Marka</span>
                <span>Model</span>
                <span>Açıklama</span>
              </div>
              <div v-for="item in requestForm.items" :key="item.uid" class="line-items-row">
                <select v-model="item.hardwareType" class="select-input">
                  <option value="">Seçiniz...</option>
                  <option v-for="option in hardwareTypeOptions" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <input
                  v-model.trim="item.quantity"
                  type="text"
                  class="text-input"
                  placeholder="1 Adet"
                  inputmode="decimal"
                />
                <input
                  v-model.trim="item.brand"
                  type="text"
                  class="text-input"
                  placeholder="Marka"
                  autocomplete="off"
                />
                <input
                  v-model.trim="item.model"
                  type="text"
                  class="text-input"
                  placeholder="Model"
                  autocomplete="off"
                />
                <input
                  v-model.trim="item.note"
                  type="text"
                  class="text-input"
                  placeholder="Açıklama"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button type="button" class="ghost-button" @click="closeRequestForm">Vazgeç</button>
            <button type="submit" class="primary-button">Gönder</button>
          </footer>
        </form>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

type RequestStatus = 'open' | 'completed' | 'cancelled';

type RouteName =
  | 'home'
  | 'inventory-tracking'
  | 'license-tracking'
  | 'printer-tracking'
  | 'stock-tracking'
  | 'request-tracking'
  | 'knowledge-base'
  | 'scrap-management'
  | 'profile'
  | 'admin-panel'
  | 'records';

interface RequestRecord {
  id: string;
  ifsNo: string;
  status: RequestStatus;
  hardwareType: string;
  brand: string;
  model: string;
  quantity: string;
  date: string;
  note: string;
  targetRoute: RouteName;
  targetLabel: string;
  cancellationReason?: string;
}

interface StatusCopy {
  id: RequestStatus;
  label: string;
  title: string;
  description: string;
  emptyMessage: string;
}

interface RequestFormItem {
  uid: number;
  hardwareType: string;
  quantity: string;
  brand: string;
  model: string;
  note: string;
}

const router = useRouter();

const requests = ref<RequestRecord[]>([
  {
    id: 'RQ-1045',
    ifsNo: 'IFS-2024-045',
    status: 'open',
    hardwareType: 'Dizüstü Bilgisayar',
    brand: 'Dell',
    model: 'Latitude 5440',
    quantity: '1 Adet',
    date: '11.03.2024',
    note: 'Yeni çalışan için cihaz bekleniyor.',
    targetRoute: 'stock-tracking',
    targetLabel: 'Stok kartına git'
  },
  {
    id: 'RQ-1046',
    ifsNo: 'IFS-2024-046',
    status: 'open',
    hardwareType: 'Yazılım Lisansı',
    brand: 'Adobe',
    model: 'Creative Cloud',
    quantity: '5 Kullanıcı',
    date: '12.03.2024',
    note: 'Finans onayı sürecinde olan lisans yenilemesi.',
    targetRoute: 'license-tracking',
    targetLabel: 'Lisans kaydına git'
  },
  {
    id: 'RQ-1041',
    ifsNo: 'IFS-2024-041',
    status: 'completed',
    hardwareType: 'Kulaklık',
    brand: 'Jabra',
    model: 'Evolve 65',
    quantity: '12 Adet',
    date: '08.03.2024',
    note: 'Teslim edildi ve envanter güncellendi.',
    targetRoute: 'inventory-tracking',
    targetLabel: 'Envanter kaydına git'
  },
  {
    id: 'RQ-1033',
    ifsNo: 'IFS-2024-033',
    status: 'completed',
    hardwareType: 'Toner',
    brand: 'HP',
    model: '410X',
    quantity: '6 Kutu',
    date: '06.03.2024',
    note: 'Teslimat sonrası yazıcı stoğu yenilendi.',
    targetRoute: 'printer-tracking',
    targetLabel: 'Yazıcı kaydına git'
  },
  {
    id: 'RQ-1027',
    ifsNo: 'IFS-2024-027',
    status: 'cancelled',
    hardwareType: 'Erişim Yetkisi',
    brand: 'SAP',
    model: 'Kullanıcı Yetkisi',
    quantity: '1 Talep',
    date: '04.03.2024',
    note: 'Talep sahibi tarafından iptal edildi. / İptal sebebi: Yetki ihtiyacı ortadan kalktı.',
    targetRoute: 'records',
    targetLabel: 'İşlem kaydına git',
    cancellationReason: 'Yetki ihtiyacı ortadan kalktı.'
  },
  {
    id: 'RQ-1019',
    ifsNo: 'IFS-2024-019',
    status: 'cancelled',
    hardwareType: 'Ofis Ekipmanı',
    brand: 'Canon',
    model: 'iR-ADV DX 4745i',
    quantity: '1 Ünite',
    date: '01.03.2024',
    note: 'Hurda komitesi kararı bekleniyor.',
    targetRoute: 'scrap-management',
    targetLabel: 'Hurda listesine git'
  }
]);

const statusCopies: StatusCopy[] = [
  {
    id: 'open',
    label: 'Açık',
    title: 'Açık Talepler',
    description: 'Onay ve tedarik bekleyen taleplerin detayları.',
    emptyMessage: 'Açık talep bulunamadı.'
  },
  {
    id: 'completed',
    label: 'Tamamlandı',
    title: 'Tamamlanan Talepler',
    description: 'Teslimatı yapılan ve envantere işlenen talepler.',
    emptyMessage: 'Tamamlanan talep bulunamadı.'
  },
  {
    id: 'cancelled',
    label: 'İptal',
    title: 'İptal Edilen Talepler',
    description: 'Talep sahibi veya yönetici tarafından iptal edilen kayıtlar.',
    emptyMessage: 'İptal edilmiş talep bulunamadı.'
  }
];

const selectedStatus = ref<RequestStatus>('open');
const isRequestFormOpen = ref(false);

const hardwareTypeOptions = [
  'Dizüstü Bilgisayar',
  'Masaüstü Bilgisayar',
  'Monitör',
  'Sunucu',
  'Yazılım Lisansı',
  'Yazıcı',
  'Tarayıcı',
  'Telefon',
  'Aksesuar'
];

let formItemCounter = 0;
const createFormItem = (): RequestFormItem => ({
  uid: formItemCounter++,
  hardwareType: '',
  quantity: '',
  brand: '',
  model: '',
  note: ''
});

const requestForm = reactive({
  ifsNo: '',
  items: [createFormItem()]
});

const statusTabs = computed(() =>
  statusCopies.map((copy) => ({
    ...copy,
    count: requests.value.filter((request) => request.status === copy.id).length
  }))
);

const activeTab = computed(() =>
  statusTabs.value.find((tab) => tab.id === selectedStatus.value) ?? statusTabs.value[0]
);

const filteredRequests = computed(() =>
  requests.value.filter((request) => request.status === selectedStatus.value)
);

const downloadExcel = () => {
  console.info('Talep listesi Excel formatında dışa aktarılmak üzere hazırlanıyor.');
};

const openRequestForm = () => {
  isRequestFormOpen.value = true;
};

const handleStockEntry = (request: RequestRecord) => {
  router.push({ name: request.targetRoute });
};

const closeRequestForm = () => {
  isRequestFormOpen.value = false;
  resetRequestForm();
};

const addLineItem = () => {
  requestForm.items.push(createFormItem());
};

const resolveTargetLink = (hardwareType: string): { route: RouteName; label: string } => {
  const normalized = hardwareType.toLowerCase();

  if (normalized.includes('lisans')) {
    return { route: 'license-tracking', label: 'Lisans kaydına git' };
  }

  if (normalized.includes('yazıcı') || normalized.includes('toner')) {
    return { route: 'stock-tracking', label: 'Stok kaydına git' };
  }

  if (normalized.includes('erişim') || normalized.includes('yetki')) {
    return { route: 'admin-panel', label: 'Admin paneline git' };
  }

  if (normalized.includes('sunucu')) {
    return { route: 'inventory-tracking', label: 'Envanter kaydına git' };
  }

  return { route: 'inventory-tracking', label: 'Envanter kaydına git' };
};

const generateIfsNo = () => {
  const now = new Date();
  return `IFS-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;
};

const resetRequestForm = () => {
  requestForm.ifsNo = '';
  requestForm.items.splice(0, requestForm.items.length, createFormItem());
};

const submitRequestForm = () => {
  const trimmedIfs = requestForm.ifsNo.trim();
  const activeItems = requestForm.items.filter((item) =>
    [item.hardwareType, item.quantity, item.brand, item.model, item.note].some((value) => value.trim() !== '')
  );

  if (activeItems.length === 0) {
    window.alert('Gönderilecek talep satırı bulunamadı. Lütfen en az bir kalem ekleyin.');
    return;
  }

  const hasInvalid = activeItems.some((item) => !item.hardwareType || !item.quantity.trim());

  if (hasInvalid) {
    window.alert('Donanım tipi ve miktar alanları zorunludur. Lütfen eksik bilgileri tamamlayın.');
    return;
  }

  const submissionDate = new Date().toLocaleDateString('tr-TR');
  const generatedIfs = trimmedIfs || generateIfsNo();

  activeItems.forEach((item) => {
    const { route, label } = resolveTargetLink(item.hardwareType);
    const newRequest: RequestRecord = {
      id: `RQ-${Math.floor(Math.random() * 9000 + 1000)}`,
      ifsNo: generatedIfs,
      status: 'open',
      hardwareType: item.hardwareType,
      brand: item.brand || 'Belirtilmedi',
      model: item.model || 'Belirtilmedi',
      quantity: item.quantity || '1 Adet',
      date: submissionDate,
      note: item.note || 'Yeni talep kaydı oluşturuldu.',
      targetRoute: route,
      targetLabel: label
    };

    requests.value.unshift(newRequest);
  });

  selectedStatus.value = 'open';
  closeRequestForm();
};

const cancelRequest = (request: RequestRecord) => {
  const reason = window.prompt('İptal sebebini giriniz', request.cancellationReason ?? '');

  if (reason === null) {
    return;
  }

  const trimmedReason = reason.trim();
  const index = requests.value.findIndex((item) => item.id === request.id);

  if (index === -1) {
    return;
  }

  const previousRecord = requests.value[index];
  const updatedRecord: RequestRecord = {
    ...previousRecord,
    status: 'cancelled',
    date: new Date().toLocaleDateString('tr-TR'),
    cancellationReason: trimmedReason || undefined,
    note: trimmedReason
      ? `${previousRecord.note.replace(/\s*\/\s*İptal sebebi:.*/, '')} / İptal sebebi: ${trimmedReason}`
      : `${previousRecord.note.replace(/\s*\/\s*İptal sebebi:.*/, '')} / İptal sebebi belirtilmedi.`
  };

  requests.value.splice(index, 1, updatedRecord);
  selectedStatus.value = 'cancelled';
};
</script>

<style scoped>
.request-page {
  display: grid;
  gap: 2rem;
  color: #0f172a;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.4rem 2.8rem;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 32px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.08);
}

.header-copy {
  display: grid;
  gap: 0.85rem;
  max-width: 560px;
}

.page-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: 2.15rem;
}

.header-copy p {
  margin: 0;
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: none;
  background: rgba(148, 163, 184, 0.16);
  color: #0f172a;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.icon-button:hover {
  background: rgba(148, 163, 184, 0.28);
}

.ghost-button,
.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 14px;
  padding: 0.75rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ghost-button {
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: #1f2937;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.ghost-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.1);
}

.primary-button {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f8fafc;
  box-shadow: 0 20px 34px rgba(37, 99, 235, 0.28);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 28px 40px rgba(37, 99, 235, 0.32);
}

.table-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 26px 50px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 1.75rem;
  padding: 2rem 2.4rem 2.4rem;
}

.table-card-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-tabs {
  display: inline-flex;
  background: rgba(248, 250, 252, 0.85);
  padding: 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  width: fit-content;
}

.tab-button {
  position: relative;
  border: none;
  background: transparent;
  color: #1f2937;
  font-weight: 600;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.tab-button.active {
  background: #2563eb;
  color: #f8fafc;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
}

.tab-button:not(.active):hover {
  background: rgba(37, 99, 235, 0.12);
}

.tab-count {
  font-size: 0.85rem;
  font-weight: 700;
}

.tab-copy {
  display: grid;
  gap: 0.45rem;
}

.tab-copy h2 {
  margin: 0;
  font-size: 1.45rem;
}

.tab-copy p {
  margin: 0;
  color: #475569;
  max-width: 540px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.table-wrapper {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(248, 250, 252, 0.7);
  overflow: hidden;
}

.request-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.request-table thead {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(14, 116, 144, 0.12));
}

.request-table th {
  text-align: left;
  padding: 1rem 1.3rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1f2937;
}

.request-table td {
  padding: 1.1rem 1.3rem;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  color: #0f172a;
  vertical-align: top;
}

.request-table tbody tr:first-of-type td {
  border-top: none;
}

.table-actions {
  text-align: right;
}

.action-group {
  display: inline-flex;
  gap: 0.5rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.action-button.stock {
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.15);
}

.action-button.stock:hover {
  background: #2563eb;
  color: #f8fafc;
}

.action-button.cancel {
  background: rgba(220, 38, 38, 0.12);
  color: #b91c1c;
  box-shadow: 0 12px 24px rgba(220, 38, 38, 0.15);
}

.action-button.cancel:hover {
  background: #dc2626;
  color: #fef2f2;
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #64748b;
  font-weight: 500;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.48);
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 2.5rem);
  z-index: 40;
}

.modal-dialog {
  width: min(880px, 100%);
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 40px 120px rgba(15, 23, 42, 0.22);
  display: flex;
  flex-direction: column;
  max-height: min(90vh, 780px);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.24);
}

.modal-title-group {
  display: grid;
  gap: 0.45rem;
}

.modal-title-group h2 {
  margin: 0;
  font-size: 1.65rem;
}

.modal-title-group p {
  margin: 0;
  color: #64748b;
  max-width: 480px;
}

.modal-body {
  display: grid;
  gap: 1.5rem;
  padding: 1.75rem 2.5rem 2rem;
  overflow-y: auto;
}

.field-label {
  font-weight: 600;
  color: #1e293b;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.optional {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.text-input,
.select-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  font-size: 0.95rem;
  background: #f8fafc;
  color: #0f172a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-input:focus,
.select-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
  background: #ffffff;
}

.line-items-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.line-items-toolbar h3 {
  margin: 0;
  font-size: 1.1rem;
}

.link-button {
  border: none;
  background: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.link-button:hover {
  background: rgba(37, 99, 235, 0.12);
}

.line-items-grid {
  display: grid;
  gap: 0.75rem;
}

.line-items-head,
.line-items-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: center;
}

.line-items-head {
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
  padding: 0 0.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem 2.5rem 2rem;
  border-top: 1px solid rgba(148, 163, 184, 0.24);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.6) 0%, rgba(241, 245, 249, 0.9) 100%);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .modal-dialog {
    border-radius: 20px;
  }

  .line-items-head,
  .line-items-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .line-items-head {
    display: none;
  }

  .line-items-row {
    gap: 0.5rem;
  }
}

@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .table-card {
    padding: 1.75rem;
  }
}

@media (max-width: 840px) {
  .status-tabs {
    flex-wrap: wrap;
    width: 100%;
  }

  .tab-button {
    flex: 1 1 auto;
    justify-content: center;
  }

  .request-table thead {
    display: none;
  }

  .request-table tr {
    display: grid;
    gap: 0.6rem;
    padding: 1.1rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  }

  .request-table tbody tr:last-of-type {
    border-bottom: none;
  }

  .request-table td {
    padding: 0;
    border: none;
  }

  .request-table td::before {
    content: attr(data-title);
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .table-wrapper {
    background: rgba(255, 255, 255, 0.92);
  }

  .table-actions {
    text-align: left;
  }

  .action-group {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .action-button {
    flex: 1 1 140px;
  }
}
</style>
