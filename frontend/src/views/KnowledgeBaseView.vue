<template>
  <section class="page-section" aria-labelledby="knowledge-title">
    <header class="page-header">
      <div>
        <h1 id="knowledge-title">Bilgi Bankası</h1>
        <p class="page-intro">
          Ekip içi dokümanlar, prosedürler ve hızlı rehberler burada tutulur. Herkesin erişebildiği
          merkezi bilgi havuzu sayesinde talep süreci ve operasyonlar tek kaynaktan yönetilir.
        </p>
      </div>

      <div class="page-tools">
        <div class="search-placeholder" role="search">
          <span aria-hidden="true">🔍</span>
          <div>
            <p class="search-title">Başlık veya etikete göre ara</p>
            <p class="search-caption">Örn: "Hurda prosedürü" ya da "ldap bağlanma"</p>
          </div>
        </div>
        <RouterLink :to="{ name: 'admin-panel' }" class="page-tool-link">
          Yetkilendirmeleri düzenle
        </RouterLink>
      </div>
    </header>

    <div class="knowledge-grid">
      <article
        v-for="category in categories"
        :key="category.id"
        class="knowledge-card"
      >
        <header class="card-header">
          <span class="card-icon" aria-hidden="true">{{ category.icon }}</span>
          <div>
            <h2>{{ category.title }}</h2>
            <p>{{ category.summary }}</p>
          </div>
        </header>
        <ul class="article-list">
          <li v-for="article in category.articles" :key="article">
            {{ article }}
          </li>
        </ul>
        <footer class="card-footer">
          <RouterLink :to="{ name: category.routeName }" class="card-link">
            {{ category.linkLabel }}
          </RouterLink>
          <p>{{ category.helperText }}</p>
        </footer>
      </article>

      <aside class="knowledge-side">
        <section class="callout" aria-labelledby="callout-title">
          <h2 id="callout-title">Talep Yönetimi ile Entegrasyon</h2>
          <p>
            Talep açan kullanıcılar ilgili dokümanları otomatik olarak görür. Örneğin hurda talepleri
            için <RouterLink :to="{ name: 'scrap-management' }">Hurdalar</RouterLink> sayfasındaki
            prosedürler öne çıkarılır.
          </p>
        </section>

        <section class="contribution" aria-labelledby="contribution-title">
          <h2 id="contribution-title">Güncel Katkılar</h2>
          <ul>
            <li v-for="entry in contributions" :key="entry.id">
              <p class="contribution-title">{{ entry.title }}</p>
              <p class="contribution-meta">
                {{ entry.author }} • {{ entry.updatedAt }}
              </p>
              <RouterLink :to="{ name: entry.relatedRoute }" class="contribution-link">
                {{ entry.relatedLabel }}
              </RouterLink>
            </li>
          </ul>
        </section>
      </aside>
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
  | 'records';

interface CategoryItem {
  id: string;
  title: string;
  summary: string;
  icon: string;
  articles: string[];
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

const categories: CategoryItem[] = [
  {
    id: 'inventory',
    title: 'Envanter İşlemleri',
    summary: 'Ürün girişleri, zimmet süreçleri ve teslim belgeleri.',
    icon: '📦',
    articles: [
      'Envanter kartı oluşturma adımları',
      'Teslim tutanağı şablonu',
      'Yeni ürün seri numarası doğrulama'
    ],
    routeName: 'inventory-tracking',
    linkLabel: 'Envanter modülünü aç',
    helperText: 'Talep sonucu gelen ürünleri envantere aktarmayı unutmayın.'
  },
  {
    id: 'licenses',
    title: 'Lisans ve Hesap Yönetimi',
    summary: 'Yazılım lisansları, kullanıcı yetkileri ve denetimler.',
    icon: '🪪',
    articles: [
      'Yeni kullanıcı lisans talep formu',
      'Lisans yenileme planı',
      'Audit trail raporlama rehberi'
    ],
    routeName: 'license-tracking',
    linkLabel: 'Lisans takibini görüntüle',
    helperText: 'Talep edilen yetkilerin onayı ve kayıtları burada tutulur.'
  },
  {
    id: 'support',
    title: 'Destek ve Hızlı Çözümler',
    summary: 'Arıza giderme, yazıcı bakımı ve sık sorulan sorular.',
    icon: '🛠️',
    articles: [
      'Yazıcı kalibrasyonu nasıl yapılır?',
      'Çağrı merkezi kulaklığı sorun giderme',
      'Destek talebi SLA politikası'
    ],
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

<style scoped>
.page-section {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.page-header {
  display: grid;
  gap: 1.75rem;
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

.page-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.search-placeholder {
  flex: 1 1 320px;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 18px;
  border: 1px dashed rgba(37, 99, 235, 0.4);
  background: rgba(59, 130, 246, 0.08);
}

.search-placeholder span {
  font-size: 1.5rem;
}

.search-title {
  margin: 0;
  font-weight: 600;
}

.search-caption {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.page-tool-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.3rem;
  border-radius: 999px;
  background: #1d4ed8;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.knowledge-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
}

.knowledge-card {
  padding: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  background: #ffffff;
  display: grid;
  gap: 1.5rem;
}

.card-header {
  display: flex;
  gap: 1.25rem;
}

.card-header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
}

.card-header p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.card-icon {
  font-size: 2rem;
}

.article-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.6rem;
  color: #475569;
}

.card-footer {
  display: grid;
  gap: 0.35rem;
}

.card-link {
  color: #2563eb;
  font-weight: 600;
}

.card-footer p {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}

.knowledge-side {
  display: grid;
  gap: 1.5rem;
}

.callout,
.contribution {
  padding: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(37, 99, 235, 0.15);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08));
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1rem;
}

.callout h2,
.contribution h2 {
  margin: 0;
  font-size: 1.3rem;
}

.callout p,
.contribution p {
  margin: 0;
  color: #1f2937;
  line-height: 1.6;
}

.contribution ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.contribution-title {
  margin: 0;
  font-weight: 600;
}

.contribution-meta {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.contribution-link {
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 600;
}

@media (max-width: 1080px) {
  .knowledge-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .page-tools {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
