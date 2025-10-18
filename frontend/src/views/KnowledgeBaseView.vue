<template>
  <section class="workspace-page" aria-labelledby="knowledge-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Doküman Merkezi</span>
          <h1 id="knowledge-title">Bilgi Bankası</h1>
          <p class="hero-intro">
            Ekip içi dokümanlar, prosedürler ve hızlı rehberler burada tutulur. Herkesin erişebildiği
            merkezi bilgi havuzu sayesinde talep süreci ve operasyonlar tek kaynaktan yönetilir.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'request-tracking' }" class="primary-action">
            Talep rehberini aç
          </RouterLink>
          <RouterLink :to="{ name: 'admin-panel' }" class="secondary-link">Yetkilendirmeleri düzenle</RouterLink>
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
      <article class="workspace-card" aria-labelledby="library-title">
        <header>
          <h2 id="library-title">Doküman Kategorileri</h2>
          <p>Envanter, lisans ve destek ekipleri için öne çıkan rehberler.</p>
        </header>
        <ul class="resource-list">
          <li v-for="category in categories" :key="category.id" class="resource-item">
            <span class="resource-icon" aria-hidden="true">{{ category.icon }}</span>
            <div class="resource-body">
              <p class="resource-title">{{ category.title }}</p>
              <p class="resource-note">{{ category.summary }}</p>
              <RouterLink :to="{ name: category.routeName }" class="resource-meta">
                {{ category.linkLabel }}
              </RouterLink>
              <p class="resource-meta">{{ category.helperText }}</p>
            </div>
          </li>
        </ul>
      </article>

      <article class="workspace-card" aria-labelledby="search-title">
        <header>
          <h2 id="search-title">Hızlı Arama</h2>
          <p>Prosedürleri etiket veya konu başlığına göre bulun.</p>
        </header>
        <div class="quick-actions">
          <RouterLink :to="{ name: 'scrap-management' }">
            Hurda prosedürlerini göster <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink :to="{ name: 'printer-tracking' }">
            Yazıcı bakım kılavuzlarını aç <span aria-hidden="true">→</span>
          </RouterLink>
          <RouterLink :to="{ name: 'license-tracking' }">
            Lisans denetim listesine git <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
        <footer>
          <RouterLink :to="{ name: 'records' }" class="card-link">Denetim raporlarına bağlan</RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="contribution-title">
        <header>
          <h2 id="contribution-title">Güncel Katkılar</h2>
          <p>Son güncellenen içerikler ve ilgili iş akışları.</p>
        </header>
        <ul class="insight-list">
          <li v-for="entry in contributions" :key="entry.id">
            <div>
              <p class="insight-title">{{ entry.title }}</p>
              <p class="insight-note">{{ entry.author }} • {{ entry.updatedAt }}</p>
            </div>
            <RouterLink :to="{ name: entry.relatedRoute }" class="insight-link">
              {{ entry.relatedLabel }}
            </RouterLink>
          </li>
        </ul>
      </article>
    </div>

  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type RouteName =
  | 'inventory-tracking'
  | 'license-tracking'
  | 'printer-tracking'
  | 'request-tracking'
  | 'scrap-management'
  | 'admin-panel'
  | 'records'
  | 'stock-tracking';

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface CategoryItem {
  id: string;
  title: string;
  summary: string;
  icon: string;
  routeName: RouteName;
  linkLabel: string;
  helperText: string;
}

interface ContributionItem {
  id: string;
  title: string;
  author: string;
  updatedAt: string;
  relatedRoute: RouteName;
  relatedLabel: string;
}

const heroMetrics: HeroMetric[] = [
  { id: 'docs', label: 'Aktif Doküman', value: '128', note: 'Bu ay güncellenen içerik sayısı' },
  { id: 'teams', label: 'Erişen Ekip', value: '6', note: 'Operasyon ekibi paylaşımları' },
  { id: 'reviews', label: 'Bekleyen İnceleme', value: '4', note: 'Onay bekleyen taslak' }
];

const categories: CategoryItem[] = [
  {
    id: 'inventory',
    title: 'Envanter İşlemleri',
    summary: 'Ürün girişleri, zimmet süreçleri ve teslim belgeleri.',
    icon: '📦',
    routeName: 'inventory-tracking',
    linkLabel: 'Envanter modülünü aç',
    helperText: 'Talep sonucu gelen ürünleri envantere aktarmayı unutmayın.'
  },
  {
    id: 'licenses',
    title: 'Lisans ve Hesap Yönetimi',
    summary: 'Yazılım lisansları, kullanıcı yetkileri ve denetimler.',
    icon: '🪪',
    routeName: 'license-tracking',
    linkLabel: 'Lisans takibini görüntüle',
    helperText: 'Talep edilen yetkilerin onayı ve kayıtları burada tutulur.'
  },
  {
    id: 'support',
    title: 'Destek ve Hızlı Çözümler',
    summary: 'Arıza giderme, yazıcı bakımı ve sık sorulan sorular.',
    icon: '🛠️',
    routeName: 'printer-tracking',
    linkLabel: 'Yazıcı takibini aç',
    helperText: 'Hurdaya ayrılan yazıcılar için ilgili prosedürlere bağlantı verilir.'
  }
];

const contributions: ContributionItem[] = [
  {
    id: '1',
    title: 'Hurda prosedürü güncellendi',
    author: 'Selin Arı',
    updatedAt: '10.03.2024',
    relatedRoute: 'scrap-management',
    relatedLabel: 'Hurda sürecine git'
  },
  {
    id: '2',
    title: 'LDAP bağlantı yönergesi',
    author: 'Baran Yıldız',
    updatedAt: '09.03.2024',
    relatedRoute: 'admin-panel',
    relatedLabel: 'Bağlantıları yapılandır'
  },
  {
    id: '3',
    title: 'Talep onay kontrol listesi',
    author: 'IT Operasyonları',
    updatedAt: '07.03.2024',
    relatedRoute: 'request-tracking',
    relatedLabel: 'Talep akışını gör'
  }
];
</script>

<style scoped src="@/styles/workspace.css"></style>
