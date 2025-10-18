<template>
  <section class="workspace-page" aria-labelledby="profile-title">
    <article class="workspace-hero">
      <header class="hero-header">
        <div class="hero-heading">
          <span class="hero-badge">Kullanıcı Merkezi</span>
          <h1 id="profile-title">Profil</h1>
          <p class="hero-intro">
            Kullanıcı bilgilerinizi, ekip sorumluluklarınızı ve bildirim tercihlerinizi tek panelden
            yönetin. Profil ayarlarınız talep, hurda ve admin modülleri ile senkronize edilerek doğru
            yetkilendirmeyi sağlar.
          </p>
        </div>
        <div class="hero-actions">
          <RouterLink :to="{ name: 'admin-panel' }" class="primary-action">Yetkileri güncelle</RouterLink>
          <RouterLink :to="{ name: 'records' }" class="secondary-link">Kayıt hareketlerini izle</RouterLink>
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
      <article class="workspace-card" aria-labelledby="identity-title">
        <header>
          <h2 id="identity-title">Kullanıcı Bilgileri</h2>
          <p>Zimmet, talep ve bildirimlerde kullanılacak temel bilgiler.</p>
        </header>
        <ul class="summary-list">
          <li v-for="item in identity" :key="item.label">
            <p class="summary-title">{{ item.label }}</p>
            <p class="summary-note">{{ item.value }}</p>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'inventory-tracking' }" class="card-link">
            Zimmetli varlıkları gör
          </RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="responsibility-title">
        <header>
          <h2 id="responsibility-title">Ekip ve Sorumluluklar</h2>
          <p>Operasyon süreçlerinde aktif rol aldığınız alanlar.</p>
        </header>
        <ul class="bullet-list">
          <li v-for="item in responsibilities" :key="item.id">
            <p class="summary-title">{{ item.title }}</p>
            <p class="summary-note">{{ item.description }}</p>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'request-tracking' }" class="card-link">
            Talep görevlerini aç
          </RouterLink>
        </footer>
      </article>

      <article class="workspace-card" aria-labelledby="preference-title">
        <header>
          <h2 id="preference-title">Bildirim Tercihleri</h2>
          <p>Talep, hurda ve admin işlemleri için tercih edilen iletişim kanalları.</p>
        </header>
        <ul class="preference-list">
          <li v-for="item in preferences" :key="item.id">
            <p class="preference-title">{{ item.title }}</p>
            <p class="preference-note">{{ item.description }}</p>
            <span class="preference-badge">{{ item.channel }}</span>
          </li>
        </ul>
      </article>

    </div>

    <article class="workflow-card">
      <h2>Profil Senkronizasyonu</h2>
      <ol class="workflow-steps">
        <li>Profil bilgilerinizde yapılan güncellemeler tüm modüllerde eşzamanlı görünür.</li>
        <li>Yetki matrisindeki değişiklikler onaylandığında bildirim tercihleri kontrol edilir.</li>
        <li>Tüm hareketler düzenli olarak denetlenir ve ekiplerle paylaşılır.</li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface HeroMetric {
  id: string;
  label: string;
  value: string;
  note: string;
}

interface IdentityItem {
  label: string;
  value: string;
}

interface ResponsibilityItem {
  id: string;
  title: string;
  description: string;
}

interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  channel: string;
}

const heroMetrics: HeroMetric[] = [
  { id: 'role', label: 'Rol', value: 'Operasyon Yöneticisi', note: 'Talep ve hurda onay yetkisine sahip' },
  { id: 'status', label: 'Durum', value: 'Aktif', note: 'Son giriş 12.03.2024 11:24' },
  { id: 'teams', label: 'Ekipler', value: '3', note: 'Talep, Hurda, Bilgi Bankası' }
];

const identity: IdentityItem[] = [
  { label: 'Kullanıcı Adı', value: 'syilmaz' },
  { label: 'İsim', value: 'Selin Yılmaz' },
  { label: 'Departman', value: 'BT Operasyonları' },
  { label: 'E-posta', value: 'selin.yilmaz@example.com' },
  { label: 'Telefon', value: '+90 555 123 45 67' }
];

const responsibilities: ResponsibilityItem[] = [
  {
    id: 'requests',
    title: 'Talep onay süreçleri',
    description: 'Talep SLA hedeflerini takip eder ve stok teyidi sağlar.'
  },
  {
    id: 'scrap',
    title: 'Hurda değerlendirme komitesi',
    description: 'Teknik raporları derleyerek karar toplantılarını yönetir.'
  },
  {
    id: 'knowledge',
    title: 'Bilgi bankası içerik sahibi',
    description: 'Güncel prosedürleri yayınlar ve ekiplerle paylaşır.'
  }
];

const preferences: PreferenceItem[] = [
  {
    id: '1',
    title: 'Talep durumu güncellemesi',
    description: 'Onaylanan veya reddedilen taleplerde bildirim al.',
    channel: 'E-posta'
  },
  {
    id: '2',
    title: 'Hurda değerlendirme kararı',
    description: 'Hurda listesine yeni bir kayıt eklendiğinde uyarı.',
    channel: 'Slack'
  },
  {
    id: '3',
    title: 'Admin paneli değişiklikleri',
    description: 'LDAP bağlantısı veya rol güncellemesi olduğunda bilgi.',
    channel: 'Mobil'
  }
];
</script>

<style scoped src="@/styles/workspace.css"></style>
