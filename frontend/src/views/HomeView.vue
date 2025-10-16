<template>
  <section class="home-wrapper" aria-labelledby="home-title">
    <header>
      <h1 id="home-title">Ana Sayfa</h1>
      <p class="home-subtitle">
        Hoş geldiniz! Bu alan ileride oluşturacağımız diğer modüller için başlangıç noktasıdır.
      </p>
    </header>

    <article class="home-card">
      <h2>Sonraki Adımlar</h2>
      <ul>
        <li>Yeni sayfalar ekleyip router üzerinden bağlantı kurabilirsiniz.</li>
        <li>Gerçek bir API ile kimlik doğrulaması entegre edebilirsiniz.</li>
        <li>Dashboard, raporlar veya ayarlar gibi alt sayfalar oluşturabilirsiniz.</li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.home-wrapper {
  width: min(720px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 2rem;
  color: #0f172a;
}

header h1 {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
}

.home-subtitle {
  color: #475569;
  font-size: 1.05rem;
}

.home-card {
  padding: 2rem;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.home-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.home-card ul {
  display: grid;
  gap: 0.75rem;
  list-style: disc inside;
  color: #1e293b;
}
</style>
