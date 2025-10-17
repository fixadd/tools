<template>
  <section class="page-section" aria-labelledby="profile-title">
    <header class="page-header">
      <div>
        <h1 id="profile-title">Profil</h1>
        <p class="page-intro">
          Kullanıcı bilgilerinizi, ekip sorumluluklarınızı ve bildirim tercihlerinizi yönetin. Profil
          bilgileri talep ve admin modülleri ile paylaşılarak yetkilerin doğru şekilde atanmasını sağlar.
        </p>
      </div>
      <RouterLink :to="{ name: 'records' }" class="header-link">Hesap hareketlerini görüntüle</RouterLink>
    </header>

    <div class="profile-grid">
      <article class="profile-card" aria-labelledby="identity-title">
        <header>
          <h2 id="identity-title">Kullanıcı Bilgileri</h2>
          <p>Zimmet, talep ve bildirimlerde kullanılacak temel bilgiler.</p>
        </header>
        <dl class="profile-list">
          <div v-for="item in identity" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <footer>
          <RouterLink :to="{ name: 'admin-panel' }" class="card-link">
            Yetki matrisini kontrol et
          </RouterLink>
        </footer>
      </article>

      <article class="profile-card" aria-labelledby="responsibility-title">
        <header>
          <h2 id="responsibility-title">Ekip ve Sorumluluklar</h2>
          <p>Operasyon süreçlerinde aktif rol aldığınız alanlar.</p>
        </header>
        <ul class="bullet-list">
          <li v-for="item in responsibilities" :key="item">{{ item }}</li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'request-tracking' }" class="card-link">
            Talep görevlerini aç
          </RouterLink>
        </footer>
      </article>

      <article class="profile-card" aria-labelledby="preference-title">
        <header>
          <h2 id="preference-title">Bildirim Tercihleri</h2>
          <p>Talep, hurda ve admin işlemleri için bildirim tercihleri.</p>
        </header>
        <ul class="preference-list">
          <li v-for="item in preferences" :key="item.id">
            <p class="preference-title">{{ item.title }}</p>
            <p class="preference-note">{{ item.description }}</p>
            <span class="preference-badge">{{ item.channel }}</span>
          </li>
        </ul>
      </article>

      <article class="profile-card" aria-labelledby="connections-title">
        <header>
          <h2 id="connections-title">Bağlı Modüller</h2>
          <p>Kullanıcı bilgilerinizin aktarıldığı uygulama alanları.</p>
        </header>
        <ul class="connection-list">
          <li v-for="connection in connections" :key="connection.id">
            <div>
              <p class="connection-title">{{ connection.title }}</p>
              <p class="connection-note">{{ connection.note }}</p>
            </div>
            <RouterLink :to="{ name: connection.routeName }" class="connection-link">
              {{ connection.linkLabel }}
            </RouterLink>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type ConnectedRoute = 'request-tracking' | 'knowledge-base' | 'scrap-management' | 'admin-panel';

interface IdentityItem {
  label: string;
  value: string;
}

interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  channel: string;
}

interface ConnectionItem {
  id: string;
  title: string;
  note: string;
  routeName: ConnectedRoute;
  linkLabel: string;
}

const identity: IdentityItem[] = [
  { label: 'Kullanıcı Adı', value: 'syilmaz' },
  { label: 'İsim', value: 'Selin Yılmaz' },
  { label: 'Departman', value: 'BT Operasyonları' },
  { label: 'E-posta', value: 'selin.yilmaz@example.com' },
  { label: 'Telefon', value: '+90 555 123 45 67' }
];

const responsibilities: string[] = [
  'Talep onaylarını yönetir ve SLA takibini yapar.',
  'Hurda komitesi toplantılarında teknik rapor sunar.',
  'Bilgi bankası içeriklerini günceller ve ekiplerle paylaşır.'
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

const connections: ConnectionItem[] = [
  {
    id: '1',
    title: 'Talep Yönetimi',
    note: 'Taleplerde onaylayıcı ve takipçi olarak atanırsınız.',
    routeName: 'request-tracking',
    linkLabel: 'Talep akışına git'
  },
  {
    id: '2',
    title: 'Bilgi Bankası',
    note: 'Dokümanlarda yazar ve editör olarak görünürsünüz.',
    routeName: 'knowledge-base',
    linkLabel: 'İçerikleri düzenle'
  },
  {
    id: '3',
    title: 'Hurdalar',
    note: 'Hurda taleplerinde teknik raporlarınız paylaşılır.',
    routeName: 'scrap-management',
    linkLabel: 'Hurda sürecini aç'
  },
  {
    id: '4',
    title: 'Admin Paneli',
    note: 'Rol ve yetki yönetimi için profil bilgileriniz kullanılır.',
    routeName: 'admin-panel',
    linkLabel: 'Yetkileri görüntüle'
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
  max-width: 760px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.header-link {
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  background: #1d4ed8;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.profile-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.profile-card {
  padding: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  background: #ffffff;
  display: grid;
  gap: 1.5rem;
}

.profile-card header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
}

.profile-card header p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.profile-list {
  margin: 0;
  display: grid;
  gap: 1rem;
}

.profile-list div {
  display: grid;
  gap: 0.35rem;
}

.profile-list dt {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.profile-list dd {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.card-link {
  color: #2563eb;
  font-weight: 600;
}

.bullet-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.6rem;
  color: #475569;
}

.preference-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.preference-list li {
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(241, 245, 249, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.25);
  display: grid;
  gap: 0.35rem;
}

.preference-title {
  margin: 0;
  font-weight: 600;
}

.preference-note {
  margin: 0;
  font-size: 0.9rem;
  color: #475569;
}

.preference-badge {
  justify-self: flex-start;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 600;
}

.connection-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.connection-list li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(241, 245, 249, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.connection-title {
  margin: 0 0 0.35rem;
  font-weight: 600;
}

.connection-note {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
}

.connection-link {
  color: #2563eb;
  font-weight: 600;
  font-size: 0.85rem;
}

@media (max-width: 720px) {
  .connection-list li {
    flex-direction: column;
  }
}
</style>
