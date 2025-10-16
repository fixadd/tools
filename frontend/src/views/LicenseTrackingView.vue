<template>
  <section class="page-section" aria-labelledby="license-title">
    <header class="page-header">
      <h1 id="license-title">Lisans Takip</h1>
      <p class="page-intro">
        Yazılım lisanslarını merkezileştirin. Sona eren veya yeni satın alınan lisansları, kullanım
        haklarını ve atamaları buradan izleyin.
      </p>
    </header>

    <div class="page-panels">
      <article class="page-card">
        <h2>Kontrol Listesi</h2>
        <ul>
          <li>Lisans tipine göre (per seat, per device vb.) görünürlük.</li>
          <li>Uyarı süresi tanımlayarak yaklaşan yenilemeleri takip edin.</li>
          <li>Aktif kullanıcı eşleştirmesi ve boşta kalan lisans raporu.</li>
        </ul>
      </article>

      <article class="page-card">
        <h2>Önerilen Entegrasyonlar</h2>
        <p>
          Envanter modülündeki cihazlarla lisansları eşleştirerek hangi uygulamanın hangi makinede
          çalıştığını görün. Talep modülü ile lisans taleplerini otomatik onay akışına dahil edin.
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
