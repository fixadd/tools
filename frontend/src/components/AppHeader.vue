<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-titles">
        <span class="eyebrow">Yönetim Kontrolü</span>
        <h1>{{ pageTitle }}</h1>
        <p class="header-subtitle">{{ pageSubtitle }}</p>
      </div>
      <div class="header-actions">
        <div class="user-chip" aria-label="Aktif kullanıcı">
          <div class="avatar" aria-hidden="true">AT</div>
          <div class="user-details">
            <span class="username">Admin Kullanıcısı</span>
            <span class="user-role">Sistem Yönetimi</span>
          </div>
        </div>
        <button type="button" class="logout" @click="handleLogout">
          Çıkış Yap
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const auth = useAuth();

const pageTitle = computed(() => {
  const title = route.meta?.title;
  return typeof title === 'string' && title.length > 0 ? title : 'Kontrol Paneli';
});

const pageSubtitle = computed(() => {
  const map: Record<string, string> = {
    home: 'Genel metrikler ve kritik stok durumunu buradan takip edin.',
    'inventory-tracking': 'Donanım varlıklarını, lokasyonları ve zimmet süreçlerini yönetin.',
    'license-tracking': 'Lisans süreleri, sahiplikler ve yenileme işlemlerini planlayın.',
    'printer-tracking': 'Yazıcı filonuzun durumunu ve sarf malzemesi ihtiyaçlarını izleyin.',
    'stock-tracking': 'Depo giriş-çıkış hareketlerini ve kritik stok eşiklerini gözden geçirin.',
    'request-tracking': 'Talep açılışlarını, onay süreçlerini ve teslimatları yönetin.',
    'knowledge-base': 'Prosedürler ve rehberlerle ekiplerinizi güncel tutun.',
    'scrap-management': 'Hurdaya ayrılan ürünlerin sürecini ve geri dönüşüm kayıtlarını izleyin.',
    profile: 'Kullanıcı bilgilerinizi, yetkilerinizi ve bildirim tercihlerinizi düzenleyin.',
    'admin-panel': 'Rolleri, modülleri ve bağlantıları tek yerden yönetin.',
    records: 'Modül bazlı işlem geçmişini inceleyin ve denetleyin.'
  };

  const name = (route.name ?? '').toString();
  return map[name] ?? 'Modül detaylarını yönetin ve güncel kalın.';
});

const handleLogout = () => {
  auth.logout();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.app-header {
  padding: 1.75rem 3rem 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-titles {
  display: grid;
  gap: 0.35rem;
}

.eyebrow {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #2563eb;
}

h1 {
  margin: 0;
  font-size: 1.95rem;
  color: #0f172a;
}

.header-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: #475569;
  max-width: 520px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.8rem 0.5rem 0.5rem;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.avatar {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #f8fafc;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.username {
  font-weight: 600;
  color: #1e293b;
}

.user-role {
  font-size: 0.8rem;
  color: #2563eb;
  font-weight: 600;
}

.logout {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  color: #f8fafc;
  padding: 0.7rem 1.6rem;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(37, 99, 235, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.logout:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(37, 99, 235, 0.3);
}

.logout:active {
  transform: translateY(0);
  box-shadow: 0 10px 18px rgba(37, 99, 235, 0.25);
}

@media (max-width: 900px) {
  .app-header {
    padding: 1.5rem 1.75rem 1.25rem;
  }

  .header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 520px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .logout {
    width: 100%;
    text-align: center;
  }
}
</style>
