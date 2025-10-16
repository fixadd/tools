<template>
  <section class="page-section" aria-labelledby="scrap-title">
    <header class="page-header">
      <h1 id="scrap-title">Hurdalar</h1>
      <p class="page-intro">
        Hurdaya ayrılması planlanan veya süreci devam eden ekipmanları listeleyin. Onay süreçleri ve
        elden çıkarma belgeleri bu bölümde tutulacaktır.
      </p>
    </header>

    <div class="page-panels">
      <article class="page-card">
        <h2>Takip Başlıkları</h2>
        <ul>
          <li>Hurda nedenleri ve finansal etkilerinin kaydı.</li>
          <li>Yetkili onay zincirlerinin takibi.</li>
          <li>Fotoğraf ve belge ekleri için arşiv alanı.</li>
        </ul>
      </article>

      <article class="page-card">
        <h2>Entegrasyon Senaryoları</h2>
        <p>
          Envanter kartlarını hurda durumuna geçirerek stoktan düşmesini sağlayın. Kayıtlar modülü ile
          birlikte tüm geçmiş işlemleri raporlayın.
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 2.5rem;
  color: #0f172a;
}

.page-header h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

.page-intro {
  margin: 0;
  max-width: 720px;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
}

.page-panels {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.page-card {
  padding: 2.25rem;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 45px rgba(15, 23, 42, 0.1);
  display: grid;
  gap: 1.1rem;
}

.page-card h2 {
  margin: 0;
  font-size: 1.4rem;
}

.page-card p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.page-card ul {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.65rem;
  color: #475569;
}
</style>
