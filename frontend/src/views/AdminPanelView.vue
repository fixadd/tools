<template>
  <section class="page-section" aria-labelledby="admin-title">
    <header class="page-header">
      <div>
        <h1 id="admin-title">Admin Paneli</h1>
        <p class="page-intro">
          Kullanıcıları yönet, ürün kataloglarını güncelle ve bağlantı yapılandırmalarını düzenle.
          Admin paneli tüm modüllerin ortak verilerinin tutulduğu merkezi yönetim alanıdır.
        </p>
      </div>
      <RouterLink :to="{ name: 'records' }" class="header-link">
        Kayıt geçmişini aç
      </RouterLink>
    </header>

    <div class="admin-grid">
      <article class="admin-card" aria-labelledby="users-title">
        <header>
          <h2 id="users-title">Kullanıcılar</h2>
          <p>Rolleri ve erişim düzeyleri ile birlikte aktif kullanıcı listesi.</p>
        </header>
        <table class="admin-table">
          <thead>
            <tr>
              <th scope="col">Kullanıcı</th>
              <th scope="col">Rol</th>
              <th scope="col">Modül</th>
              <th scope="col">Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.username">
              <td>
                <span class="user-name">{{ user.fullName }}</span>
                <span class="user-username">{{ user.username }}</span>
              </td>
              <td>{{ user.role }}</td>
              <td>{{ user.modules.join(', ') }}</td>
              <td>{{ user.state }}</td>
            </tr>
          </tbody>
        </table>
        <footer>
          <RouterLink :to="{ name: 'profile' }" class="card-link">
            Profil bilgilerini düzenle
          </RouterLink>
        </footer>
      </article>

      <article class="admin-card" aria-labelledby="products-title">
        <header>
          <h2 id="products-title">Ürün Kütüphanesi</h2>
          <p>Talep ve envanter modüllerinde kullanılacak ortak ürün listeleri.</p>
        </header>
        <ul class="product-list">
          <li v-for="product in products" :key="product.id">
            <div>
              <p class="product-title">{{ product.title }}</p>
              <p class="product-meta">{{ product.category }} • {{ product.count }} kayıt</p>
              <p class="product-note">{{ product.note }}</p>
            </div>
            <RouterLink :to="{ name: product.routeName }" class="product-link">
              {{ product.linkLabel }}
            </RouterLink>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'request-tracking' }" class="card-link">
            Talep açılış formunu güncelle
          </RouterLink>
        </footer>
      </article>

      <article class="admin-card" aria-labelledby="integrations-title">
        <header>
          <h2 id="integrations-title">Bağlantılar</h2>
          <p>LDAP ve diğer entegrasyonlar ile sistemler arası senkronizasyonu yapılandır.</p>
        </header>
        <ul class="integration-list">
          <li v-for="integration in integrations" :key="integration.id">
            <div>
              <p class="integration-title">{{ integration.title }}</p>
              <p class="integration-note">{{ integration.note }}</p>
            </div>
            <RouterLink :to="{ name: integration.routeName }" class="integration-link">
              {{ integration.linkLabel }}
            </RouterLink>
          </li>
        </ul>
        <footer>
          <RouterLink :to="{ name: 'knowledge-base' }" class="card-link">
            Bağlantı yönergelerini aç
          </RouterLink>
        </footer>
      </article>
    </div>

    <article class="workflow-card">
      <h2>Yönetim Döngüsü</h2>
      <ol class="workflow-steps">
        <li>
          Kullanıcı rolü atandığında ilgili bildirimler
          <RouterLink :to="{ name: 'profile' }">Profil</RouterLink> sayfasında görüntülenir.
        </li>
        <li>
          Ürün kütüphanesine eklenen kayıtlar otomatik olarak
          <RouterLink :to="{ name: 'request-tracking' }">Talep Takip</RouterLink> ve
          <RouterLink :to="{ name: 'inventory-tracking' }">Envanter Takip</RouterLink>
          formlarına yansır.
        </li>
        <li>
          LDAP ayarları güncellendiğinde sonuçlar
          <RouterLink :to="{ name: 'records' }">Kayıtlar</RouterLink> modülünde loglanır ve bilgi
          bankasına aktarılır.
        </li>
      </ol>
    </article>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

type RouteName =
  | 'inventory-tracking'
  | 'request-tracking'
  | 'printer-tracking'
  | 'license-tracking'
  | 'profile'
  | 'knowledge-base'
  | 'records';

interface UserItem {
  username: string;
  fullName: string;
  role: string;
  modules: string[];
  state: string;
}

interface ProductItem {
  id: string;
  title: string;
  category: string;
  count: number;
  note: string;
  routeName: RouteName;
  linkLabel: string;
}

interface IntegrationItem {
  id: string;
  title: string;
  note: string;
  routeName: RouteName;
  linkLabel: string;
}

const users: UserItem[] = [
  {
    username: 'syilmaz',
    fullName: 'Selin Yılmaz',
    role: 'Talep Onaycısı',
    modules: ['Talep', 'Hurda'],
    state: 'Aktif'
  },
  {
    username: 'byildiz',
    fullName: 'Baran Yıldız',
    role: 'Sistem Yöneticisi',
    modules: ['Admin', 'LDAP'],
    state: 'Aktif'
  },
  {
    username: 'ekara',
    fullName: 'Ebru Kara',
    role: 'Envanter Uzmanı',
    modules: ['Envanter', 'Stok'],
    state: 'İzinli'
  }
];

const products: ProductItem[] = [
  {
    id: '1',
    title: 'BT Donanımları',
    category: 'Envanter',
    count: 128,
    note: 'Dizüstü, masaüstü, monitör ve çevre birimleri listesi.',
    routeName: 'inventory-tracking',
    linkLabel: 'Envantere git'
  },
  {
    id: '2',
    title: 'Yazılım Lisansları',
    category: 'Lisans',
    count: 86,
    note: 'Adobe, Microsoft 365 ve özel uygulama lisansları.',
    routeName: 'license-tracking',
    linkLabel: 'Lisansları aç'
  },
  {
    id: '3',
    title: 'Yazıcı Sarf Malzemeleri',
    category: 'Stok',
    count: 42,
    note: 'Toner, drum ve bakım kitleri için standart kodlar.',
    routeName: 'printer-tracking',
    linkLabel: 'Yazıcı takibini görüntüle'
  }
];

const integrations: IntegrationItem[] = [
  {
    id: '1',
    title: 'Kurumsal LDAP',
    note: 'Active Directory ile kullanıcı senkronizasyonu.',
    routeName: 'records',
    linkLabel: 'Logları incele'
  },
  {
    id: '2',
    title: 'Tek oturum açma (SSO)',
    note: 'Portal girişleri için SSO sağlayıcı ayarları.',
    routeName: 'profile',
    linkLabel: 'Kullanıcı erişimini gör'
  },
  {
    id: '3',
    title: 'Talep formu API',
    note: 'Dış sistemlerden talep açılışına izin veren bağlantı.',
    routeName: 'request-tracking',
    linkLabel: 'Talepleri izle'
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
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.admin-card {
  padding: 2rem;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  background: #ffffff;
  display: grid;
  gap: 1.5rem;
}

.admin-card header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
}

.admin-card header p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.admin-table th,
.admin-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.admin-table th {
  color: #475569;
  font-weight: 600;
  background: rgba(226, 232, 240, 0.35);
}

.user-name {
  display: block;
  font-weight: 600;
}

.user-username {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
}

.card-link {
  color: #2563eb;
  font-weight: 600;
}

.product-list,
.integration-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1rem;
}

.product-list li,
.integration-list li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 16px;
  background: rgba(241, 245, 249, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.product-title,
.integration-title {
  margin: 0 0 0.35rem;
  font-weight: 600;
}

.product-meta {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.product-note,
.integration-note {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: #475569;
}

.product-link,
.integration-link {
  color: #2563eb;
  font-weight: 600;
  font-size: 0.85rem;
}

.workflow-card {
  padding: 2.5rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(14, 165, 233, 0.08));
  border: 1px solid rgba(59, 130, 246, 0.2);
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
  .product-list li,
  .integration-list li {
    flex-direction: column;
  }
}
</style>
