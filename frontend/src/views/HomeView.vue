<template>
  <section class="page-section" aria-labelledby="home-title">
    <header class="page-header">
      <h1 id="home-title">Ana Sayfa</h1>
      <p class="page-intro">
        Envanter yönetim paneline hoş geldiniz. Soldaki menüden takip modülleri, talepler ve
        yönetim araçlarına erişebilir; aşağıdaki özet alanından son durumunuzu inceleyebilirsiniz.
      </p>
    </header>

    <div class="page-grid" role="list">
      <article class="summary-card" role="listitem">
        <h2>Takip Modülleri</h2>
        <p>
          Envanter, lisans, yazıcı ve stok kayıtlarını tek noktadan yönetin. Her modülde çalışma
          listeleri, durum göstergeleri ve filtreleme seçenekleri planlanmıştır.
        </p>
        <RouterLink class="summary-link" :to="{ name: 'inventory-tracking' }">
          Envanter modülüne git
        </RouterLink>
      </article>

      <article class="summary-card" role="listitem">
        <h2>Operasyon</h2>
        <p>
          Talep kayıtlarını izleyin, bilgi bankasından prosedürlere ulaşın ve hurda listesi ile geri
          dönüşüm süreçlerini takip edin.
        </p>
        <RouterLink class="summary-link" :to="{ name: 'request-tracking' }">
          Talepleri görüntüle
        </RouterLink>
      </article>

      <article class="summary-card" role="listitem">
        <h2>Yönetim</h2>
        <p>
          Profil ayarlarınızı güncelleyin, admin panelinde yetkileri yönetin ve yapılan tüm işlem
          kayıtlarına ulaşın.
        </p>
        <RouterLink class="summary-link" :to="{ name: 'admin-panel' }">
          Yönetim araçlarını aç
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.page-section {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.page-header h1 {
  margin: 0 0 0.75rem;
  font-size: 2.25rem;
}

.page-intro {
  margin: 0;
  max-width: 720px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.page-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.summary-card {
  padding: 2rem;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 1rem;
  min-height: 220px;
}

.summary-card h2 {
  margin: 0;
  font-size: 1.4rem;
}

.summary-card p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.summary-link {
  align-self: flex-end;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.summary-link::after {
  content: '›';
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.summary-link:hover::after {
  transform: translateX(4px);
}
</style>
