<template>
  <section class="inventory-page" aria-labelledby="inventory-page-title">
    <article class="inventory-hero">
      <div class="hero-copy">
        <span class="hero-eyebrow">Envanter Yönetimi</span>
        <h1 id="inventory-page-title">Envanter Listesi</h1>
        <p>
          Envanterdeki cihazların sorumlularını, durumlarını ve bağlı oldukları modülleri tek ekrandan
          görüntüleyin. Talep, stok ve kayıt akışlarıyla entegre şekilde yönetin.
        </p>
      </div>
      <dl class="hero-metrics" aria-label="Envanter özetleri">
        <div v-for="metric in metrics" :key="metric.id">
          <dt>{{ metric.label }}</dt>
          <dd>{{ metric.value }}</dd>
          <p class="metric-note">{{ metric.note }}</p>
        </div>
      </dl>
    </article>

    <article class="inventory-card" aria-labelledby="inventory-table-title">
      <header class="inventory-card-header">
        <div>
          <h2 id="inventory-table-title">Cihazlar</h2>
          <p>IFS kayıt numaraları, sorumlular ve marka/model bilgileriyle tüm envanter kartları.</p>
        </div>
        <div class="inventory-card-actions">
          <button type="button" class="action primary" @click="openAddInventoryModal">+ Ekle</button>
          <button type="button" class="action outline" @click="showFaultyRecords">Arızalı Durum</button>
        </div>
      </header>

      <div class="inventory-toolbar">
        <nav class="inventory-segments" aria-label="Envanter durum filtreleri">
          <button
            v-for="segment in segmentOptions"
            :key="segment.id"
            type="button"
            class="segment-button"
            :class="{ active: selectedSegment === segment.id }"
            @click="selectedSegment = segment.id"
          >
            <span>{{ segment.label }}</span>
            <span class="segment-count" aria-hidden="true">{{ segment.count }}</span>
          </button>
        </nav>
        <div class="inventory-search">
          <label class="sr-only" for="inventory-search-input">Envanter ara</label>
          <input
            id="inventory-search-input"
            v-model="searchQuery"
            type="search"
            name="q"
            placeholder="Ara..."
          />
          <button type="button" class="action subtle" @click="toggleFilters">Filtrele</button>
        </div>
      </div>

      <transition name="drawer">
        <aside v-if="filtersOpen" class="filter-panel" aria-label="Envanter filtreleri">
          <header>
            <h3>Filtreler</h3>
            <p>Fabrika ve departman bazında listeyi daraltın.</p>
          </header>
          <form @submit.prevent class="filter-form">
            <label for="factory-select">Fabrika</label>
            <select id="factory-select" v-model="appliedFilters.factory">
              <option v-for="factory in factories" :key="factory" :value="factory">{{ factory }}</option>
            </select>

            <label for="department-select">Departman</label>
            <select id="department-select" v-model="appliedFilters.department">
              <option v-for="department in departments" :key="department" :value="department">
                {{ department }}
              </option>
            </select>

            <div class="filter-actions">
              <button type="button" class="action" @click="resetFilters">Temizle</button>
              <button type="button" class="action outline" @click="toggleFilters">Kapat</button>
            </div>
          </form>
        </aside>
      </transition>

      <div class="table-wrapper" role="region" aria-live="polite">
        <table class="inventory-table">
          <thead>
            <tr>
              <th scope="col">Envanter No</th>
              <th scope="col">Fabrika</th>
              <th scope="col">Departman</th>
              <th scope="col">Sorumlu</th>
              <th scope="col">Marka / Model</th>
              <th scope="col" class="actions-header">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isInventoryLoading">
              <td colspan="6" class="empty-state">Envanter verileri yükleniyor...</td>
            </tr>
            <tr v-else-if="inventoryRecords.length === 0">
              <td colspan="6" class="empty-state">Henüz envanter kaydı eklenmedi.</td>
            </tr>
            <template v-else>
              <tr v-for="record in filteredRecords" :key="record.id">
                <td data-title="Envanter No">
                  <span class="cell-title">{{ record.inventoryNo }}</span>
                  <span class="cell-meta">{{ record.statusLabel }}</span>
                </td>
                <td data-title="Fabrika">{{ record.factory }}</td>
                <td data-title="Departman">{{ record.department }}</td>
                <td data-title="Sorumlu">
                  <span class="cell-title">{{ record.responsible }}</span>
                  <span class="cell-meta">{{ record.responsibleRole }}</span>
                </td>
                <td data-title="Marka / Model">
                  <span class="cell-title">{{ record.brand }}</span>
                  <span class="cell-meta">{{ record.model }}</span>
                </td>
                <td data-title="İşlemler" class="actions-cell">
                  <label class="sr-only" :for="`inventory-action-${record.id}`">{{ record.inventoryNo }} işlemleri</label>
                  <select
                    :id="`inventory-action-${record.id}`"
                    :value="selectedActions[record.id] ?? ''"
                    @change="(event) => handleActionChange(record, (event.target as HTMLSelectElement).value)"
                  >
                    <option value="" disabled>Seçiniz...</option>
                    <option value="detail">Detaya git</option>
                    <option value="handover">Zimmet güncelle</option>
                    <option value="faulty">Arıza bildir</option>
                    <option value="history">Kayıtlara aç</option>
                  </select>
                </td>
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td colspan="6" class="empty-state">Seçili filtrelerde kayıt bulunamadı.</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </article>

    <transition name="backdrop">
      <div
        v-if="isAddModalOpen"
        class="modal-backdrop"
        role="presentation"
        @click="closeAddInventoryModal"
      >
        <transition name="modal">
          <div
            v-if="isAddModalOpen"
            class="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-inventory-title"
            aria-describedby="add-inventory-description"
            tabindex="-1"
            @keydown.esc="closeAddInventoryModal"
            @click.stop
          >
            <header class="modal-header">
              <div>
                <h2 id="add-inventory-title">Envanter Ekle</h2>
                <p id="add-inventory-description">
                  Yeni cihaz bilgilerini girin, sorumluyu seçin ve stok kayıtlarıyla ilişkilendirin.
                </p>
              </div>
              <button type="button" class="modal-close" aria-label="Pencereyi kapat" @click="closeAddInventoryModal">
                ×
              </button>
            </header>

            <form class="modal-form" @submit.prevent="submitNewInventory">
              <div class="modal-grid">
                <label class="form-field">
                  <span>Envanter No</span>
                  <input v-model="newInventoryForm.inventoryNo" type="text" placeholder="ENV-000123" />
                </label>
                <label class="form-field">
                  <span>Bilgisayar Adı</span>
                  <input v-model="newInventoryForm.computerName" type="text" placeholder="PC-OFIS-01" />
                </label>
                <label class="form-field">
                  <span>Fabrika</span>
                  <select v-model="newInventoryForm.factory">
                    <option value="" disabled>Seçiniz…</option>
                    <option v-for="factory in factoryChoices" :key="factory" :value="factory">{{ factory }}</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Departman</span>
                  <select v-model="newInventoryForm.department">
                    <option value="" disabled>Seçiniz…</option>
                    <option v-for="department in departmentChoices" :key="department" :value="department">
                      {{ department }}
                    </option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Donanım Tipi</span>
                  <select v-model="newInventoryForm.hardwareType">
                    <option value="" disabled>Seçiniz…</option>
                    <option v-for="hardware in hardwareTypes" :key="hardware" :value="hardware">{{ hardware }}</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Sorumlu Personel</span>
                  <select v-model="newInventoryForm.responsible">
                    <option value="" disabled>Seçiniz…</option>
                    <option v-for="person in personnelOptions" :key="person.id" :value="person.id">
                      {{ person.name }} - {{ person.role }}
                    </option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Marka</span>
                  <select v-model="newInventoryForm.brand">
                    <option value="" disabled>Seçiniz…</option>
                    <option v-for="brand in brandOptions" :key="brand" :value="brand">{{ brand }}</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Model</span>
                  <select v-model="newInventoryForm.model">
                    <option value="" disabled>Seçiniz…</option>
                    <option v-for="model in modelOptions" :key="model" :value="model">{{ model }}</option>
                  </select>
                </label>
                <label class="form-field">
                  <span>Seri No</span>
                  <input v-model="newInventoryForm.serialNo" type="text" placeholder="SN123456789" />
                </label>
                <label class="form-field">
                  <span>IFS No <small>(zorunlu değil)</small></span>
                  <input v-model="newInventoryForm.ifsNo" type="text" placeholder="IFS-" />
                </label>
                <label class="form-field">
                  <span>Bağlı Makina No</span>
                  <input v-model="newInventoryForm.linkedMachineNo" type="text" placeholder="MK-001" />
                </label>
                <label class="form-field">
                  <span>Makina No</span>
                  <input v-model="newInventoryForm.machineNo" type="text" placeholder="MK-002" />
                </label>
                <label class="form-field form-field--textarea">
                  <span>Açıklama / Notlar</span>
                  <textarea
                    v-model="newInventoryForm.notes"
                    rows="3"
                    placeholder="Kurulum durumu, özel notlar…"
                  ></textarea>
                </label>
              </div>

              <div class="modal-actions">
                <button type="submit" class="action primary" :disabled="isSubmittingInventory">
                  <span v-if="!isSubmittingInventory">Kaydet</span>
                  <span v-else>Kaydediliyor...</span>
                </button>
                <button type="button" class="action outline" @click="closeAddInventoryModal">İptal</button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';
import {
  fetchInventoryRecords,
  insertInventoryRecord,
  type InventoryEntity
} from '@/services/modules';

type InventoryState = 'assigned' | 'available' | 'transfer' | 'faulty';
type SegmentValue = 'all' | InventoryState;

interface InventoryRecord {
  id: string;
  inventoryNo: string;
  factory: string;
  department: string;
  responsible: string;
  responsibleRole: string;
  brand: string;
  model: string;
  state: InventoryState;
  detailRoute: RouteLocationRaw;
}

interface InventoryTableRow extends InventoryRecord {
  statusLabel: string;
}

interface MetricItem {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface SegmentOption {
  id: SegmentValue;
  label: string;
  count: number;
}

interface AppliedFilters {
  factory: string;
  department: string;
}

const router = useRouter();

const statusLabels: Record<InventoryState, string> = {
  assigned: 'Zimmetli',
  available: 'Depoda',
  transfer: 'Transferde',
  faulty: 'Arızalı'
};

const inventoryRecords = ref<InventoryRecord[]>([]);
const isInventoryLoading = ref(true);
const isSubmittingInventory = ref(false);

const resolveInventoryRoute = (routeName: string): RouteLocationRaw => {
  if (!routeName) {
    return { name: 'inventory-tracking' };
  }

  return { name: routeName as string };
};

const mapInventoryEntity = (entity: InventoryEntity): InventoryRecord => ({
  id: entity.id,
  inventoryNo: entity.inventoryNo,
  factory: entity.factory,
  department: entity.department,
  responsible: entity.responsible,
  responsibleRole: entity.responsibleRole,
  brand: entity.brand,
  model: entity.model,
  state: entity.state,
  detailRoute: resolveInventoryRoute(entity.detailRoute)
});

const loadInventoryRecords = async () => {
  try {
    const records = await fetchInventoryRecords();
    inventoryRecords.value = records.map(mapInventoryEntity);
  } catch (error) {
    console.error('Envanter kayıtları yüklenirken hata oluştu.', error);
  } finally {
    isInventoryLoading.value = false;
  }
};

onMounted(() => {
  void loadInventoryRecords();
});

const searchQuery = ref('');
const selectedSegment = ref<SegmentValue>('all');
const filtersOpen = ref(false);
const appliedFilters = reactive<AppliedFilters>({ factory: 'Tümü', department: 'Tümü' });
const selectedActions = reactive<Record<string, string>>({});

const defaultFactories = ['Gebze', 'İzmir', 'Ankara'];
const defaultDepartments = ['Üretim', 'Ar-Ge', 'Finans', 'Bakım'];

const factories = computed(() => {
  const unique = new Set(defaultFactories);
  inventoryRecords.value.forEach((record) => unique.add(record.factory));
  return ['Tümü', ...unique];
});

const departments = computed(() => {
  const unique = new Set(defaultDepartments);
  inventoryRecords.value.forEach((record) => unique.add(record.department));
  return ['Tümü', ...unique];
});

const factoryChoices = computed(() => factories.value.filter((factory) => factory !== 'Tümü'));
const departmentChoices = computed(() => departments.value.filter((department) => department !== 'Tümü'));

const metrics = computed<MetricItem[]>(() => {
  const totals = inventoryRecords.value.reduce(
    (acc, record) => {
      acc[record.state] += 1;
      return acc;
    },
    {
      assigned: 0,
      available: 0,
      transfer: 0,
      faulty: 0
    } as Record<InventoryState, number>
  );

  return [
    { id: 'total', label: 'Toplam Kayıt', value: String(inventoryRecords.value.length), note: 'Aktif envanter' },
    { id: 'assigned', label: 'Zimmetli', value: String(totals.assigned), note: 'Teslim edilmiş cihaz' },
    { id: 'transfer', label: 'Transferde', value: String(totals.transfer), note: 'Atama bekleyen' },
    { id: 'faulty', label: 'Arızalı', value: String(totals.faulty), note: 'İyileştirme bekleyen' }
  ];
});

const segmentOptions = computed<SegmentOption[]>(() => {
  const baseCounts = inventoryRecords.value.reduce(
    (acc, record) => {
      acc[record.state] += 1;
      return acc;
    },
    {
      assigned: 0,
      available: 0,
      transfer: 0,
      faulty: 0
    } as Record<InventoryState, number>
  );

  return [
    { id: 'all', label: 'Tümü', count: inventoryRecords.value.length },
    { id: 'assigned', label: 'Zimmetli', count: baseCounts.assigned },
    { id: 'available', label: 'Depoda', count: baseCounts.available },
    { id: 'transfer', label: 'Transferde', count: baseCounts.transfer },
    { id: 'faulty', label: 'Arızalı', count: baseCounts.faulty }
  ];
});

const filteredRecords = computed<InventoryTableRow[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return inventoryRecords.value
    .filter((record) => (selectedSegment.value === 'all' ? true : record.state === selectedSegment.value))
    .filter((record) =>
      appliedFilters.factory === 'Tümü' ? true : record.factory.toLowerCase() === appliedFilters.factory.toLowerCase()
    )
    .filter((record) =>
      appliedFilters.department === 'Tümü'
        ? true
        : record.department.toLowerCase() === appliedFilters.department.toLowerCase()
    )
    .filter((record) => {
      if (!query) {
        return true;
      }

      return [
        record.inventoryNo,
        record.factory,
        record.department,
        record.responsible,
        record.brand,
        record.model
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    })
    .map((record) => ({
      ...record,
      statusLabel: statusLabels[record.state]
    }));
});

const toggleFilters = () => {
  filtersOpen.value = !filtersOpen.value;
};

const resetFilters = () => {
  appliedFilters.factory = 'Tümü';
  appliedFilters.department = 'Tümü';
};

const personnelOptions = [
  { id: 'ahmet-demir', name: 'Ahmet Demir', role: 'Hat Süpervizörü' },
  { id: 'elif-kaya', name: 'Elif Kaya', role: 'Finans Uzmanı' },
  { id: 'selin-ucar', name: 'Selin Uçar', role: 'Yazılım Mühendisi' },
  { id: 'mert-yildiz', name: 'Mert Yıldız', role: 'Tekniker' }
];

const hardwareTypes = ['Laptop', 'Masaüstü', 'Sunucu', 'Endüstriyel Panel'];
const brandOptions = ['Dell', 'HP', 'Lenovo', 'Apple', 'Siemens'];
const modelOptions = ['Latitude 7440', 'ProBook 450 G10', 'ThinkPad L15', 'MacBook Pro 14"', 'IPC 477E'];

const isAddModalOpen = ref(false);

const newInventoryForm = reactive({
  inventoryNo: '',
  computerName: '',
  factory: '',
  department: '',
  hardwareType: '',
  responsible: '',
  brand: '',
  model: '',
  serialNo: '',
  ifsNo: '',
  linkedMachineNo: '',
  machineNo: '',
  notes: ''
});

const resetNewInventoryForm = () => {
  newInventoryForm.inventoryNo = '';
  newInventoryForm.computerName = '';
  newInventoryForm.factory = '';
  newInventoryForm.department = '';
  newInventoryForm.hardwareType = '';
  newInventoryForm.responsible = '';
  newInventoryForm.brand = '';
  newInventoryForm.model = '';
  newInventoryForm.serialNo = '';
  newInventoryForm.ifsNo = '';
  newInventoryForm.linkedMachineNo = '';
  newInventoryForm.machineNo = '';
  newInventoryForm.notes = '';
};

const openAddInventoryModal = () => {
  resetNewInventoryForm();
  isAddModalOpen.value = true;
};

const closeAddInventoryModal = () => {
  isAddModalOpen.value = false;
  resetNewInventoryForm();
};

const createInventoryId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }

  return `INV-${Date.now()}`;
};

const generateInventoryNumber = () => {
  if (newInventoryForm.inventoryNo.trim()) {
    return newInventoryForm.inventoryNo.trim();
  }

  const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
  return `IFS-ENV-${randomSuffix}`;
};

const submitNewInventory = async () => {
  if (isSubmittingInventory.value) {
    return;
  }

  isSubmittingInventory.value = true;
  const responsible = personnelOptions.find((person) => person.id === newInventoryForm.responsible);

  const inventoryNo = generateInventoryNumber();
  const id = createInventoryId();

  const newRecord: InventoryRecord = {
    id,
    inventoryNo,
    factory: newInventoryForm.factory || 'Gebze',
    department: newInventoryForm.department || 'Üretim',
    responsible: responsible?.name || 'Belirsiz Kullanıcı',
    responsibleRole: responsible?.role || 'Sorumlu Atanacak',
    brand: newInventoryForm.brand || 'Dell',
    model: newInventoryForm.model || 'Latitude 7440',
    state: 'available',
    detailRoute: { name: 'stock-tracking', query: { ref: inventoryNo } }
  };
  try {
    await insertInventoryRecord({
      id,
      inventoryNo,
      factory: newRecord.factory,
      department: newRecord.department,
      responsible: newRecord.responsible,
      responsibleRole: newRecord.responsibleRole,
      brand: newRecord.brand,
      model: newRecord.model,
      state: newRecord.state,
      detailRoute: 'stock-tracking'
    });

    inventoryRecords.value = [newRecord, ...inventoryRecords.value];
    closeAddInventoryModal();
    router.push({ name: 'stock-tracking', query: { source: 'inventory' } });
  } catch (error) {
    console.error('Envanter kaydı oluşturulamadı.', error);
    window.alert('Envanter kaydı kaydedilirken bir sorun oluştu.');
  } finally {
    isSubmittingInventory.value = false;
  }
};

const showFaultyRecords = () => {
  selectedSegment.value = 'faulty';
  filtersOpen.value = false;
};

const handleActionChange = (record: InventoryRecord, action: string) => {
  selectedActions[record.id] = action;

  switch (action) {
    case 'detail':
      router.push(record.detailRoute);
      break;
    case 'handover':
      router.push({ name: 'request-tracking' });
      break;
    case 'faulty':
      router.push({ name: 'scrap-management' });
      break;
    case 'history':
      router.push({ name: 'records' });
      break;
    default:
      break;
  }
};
</script>

<style scoped src="@/styles/workspace.css"></style>

<style scoped>
.inventory-page {
  display: grid;
  gap: 2.5rem;
}

.inventory-hero {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 45%, #e0f2fe 100%);
  border-radius: 32px;
  border: 1px solid rgba(96, 165, 250, 0.35);
  padding: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 24px 64px rgba(59, 130, 246, 0.22);
}

.hero-copy {
  max-width: 620px;
  display: grid;
  gap: 1rem;
  color: #0f172a;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.18);
  color: #1d4ed8;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  font-size: 2.4rem;
}

.hero-copy p {
  margin: 0;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.78);
}

.hero-metrics {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin: 0;
}

.hero-metrics dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(30, 64, 175, 0.86);
  margin-bottom: 0.35rem;
}

.hero-metrics dd {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e3a8a;
}

.metric-note {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: rgba(30, 64, 175, 0.72);
}

.inventory-card {
  background: #ffffff;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 32px 68px rgba(15, 23, 42, 0.12);
  padding: 2.25rem;
  display: grid;
  gap: 2rem;
}

.inventory-card-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: flex-start;
}

.inventory-card-header h2 {
  margin: 0 0 0.35rem;
  font-size: 1.6rem;
}

.inventory-card-header p {
  margin: 0;
  color: #475569;
  max-width: 540px;
}

.inventory-card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.6rem;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.action.primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f8fafc;
  box-shadow: 0 18px 40px rgba(37, 99, 235, 0.35);
}

.action.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 24px 48px rgba(37, 99, 235, 0.38);
}

.action.outline {
  background: #f8fafc;
  border: 1px solid rgba(37, 99, 235, 0.32);
  color: #1d4ed8;
}

.action.subtle {
  background: rgba(148, 163, 184, 0.14);
  color: #1e293b;
}

.inventory-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
  align-items: center;
}

.inventory-segments {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.segment-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(248, 250, 252, 0.8);
  color: #1e293b;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.segment-button.active {
  background: rgba(37, 99, 235, 0.16);
  border-color: rgba(37, 99, 235, 0.5);
  color: #1d4ed8;
}

.segment-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.16);
  color: #1d4ed8;
  font-size: 0.78rem;
}

.inventory-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.inventory-search input {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.55rem 1rem;
  min-width: 240px;
  font-size: 0.95rem;
}

.filter-panel {
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 20px;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
}

.filter-panel header {
  display: grid;
  gap: 0.35rem;
}

.filter-form {
  display: grid;
  gap: 1rem;
}

.filter-form label {
  font-weight: 600;
  color: #1e293b;
}

.filter-form select {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.5rem 0.75rem;
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.table-wrapper {
  overflow-x: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.inventory-table thead {
  background: rgba(15, 23, 42, 0.04);
}

.inventory-table th,
.inventory-table td {
  padding: 0.9rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.28);
  color: #0f172a;
}

.inventory-table th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(71, 85, 105, 0.9);
}

.cell-title {
  display: block;
  font-weight: 600;
}

.cell-meta {
  display: block;
  margin-top: 0.2rem;
  color: #64748b;
  font-size: 0.85rem;
}

.actions-header {
  text-align: right;
}

.actions-cell {
  text-align: right;
}

.actions-cell select {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.45rem 0.75rem;
  min-width: 170px;
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #475569;
  font-weight: 500;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.32);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 2rem;
  z-index: 40;
}

.modal-card {
  background: #ffffff;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  max-width: 960px;
  width: min(100%, 900px);
  box-shadow: 0 36px 72px rgba(15, 23, 42, 0.22);
  display: grid;
  gap: 1.75rem;
  padding: 2.25rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.modal-header h2 {
  margin: 0 0 0.35rem;
}

.modal-header p {
  margin: 0;
  color: #475569;
}

.modal-close {
  background: rgba(148, 163, 184, 0.16);
  border: none;
  border-radius: 999px;
  width: 2.25rem;
  height: 2.25rem;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  color: #1e293b;
}

.modal-form {
  display: grid;
  gap: 1.75rem;
}

.modal-grid {
  display: grid;
  gap: 1.25rem 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-field {
  display: grid;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.form-field span {
  font-weight: 600;
  color: #0f172a;
}

.form-field small {
  font-weight: 500;
  color: #64748b;
}

.form-field input,
.form-field select,
.form-field textarea {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  padding: 0.65rem 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  background: rgba(248, 250, 252, 0.85);
}

.form-field textarea {
  resize: vertical;
}

.form-field--textarea {
  grid-column: 1 / -1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.85rem;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

@media (max-width: 768px) {
  .inventory-card {
    padding: 1.75rem;
  }

  .inventory-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .inventory-search {
    width: 100%;
    justify-content: space-between;
  }

  .inventory-search input {
    flex: 1;
  }

  .inventory-table {
    min-width: unset;
  }

  .modal-card {
    padding: 1.75rem;
    border-radius: 22px;
  }

  .modal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
