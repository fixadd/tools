<template>
  <section class="login-wrapper" aria-labelledby="login-title">
    <h1 id="login-title">Hesabınıza giriş yapın</h1>
    <p class="login-subtitle">
      Ana sayfaya ulaşmak için kullanıcı adı ve şifrenizi girin.
      <span class="hint">(admin / 123456)</span>
    </p>

    <form class="login-form" @submit.prevent="handleSubmit" novalidate>
      <label class="form-field">
        <span>Kullanıcı Adı</span>
        <input
          v-model.trim="form.username"
          type="text"
          name="username"
          autocomplete="username"
          required
          placeholder="örn. admin"
        />
      </label>

      <label class="form-field">
        <span>Şifre</span>
        <input
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
          placeholder="örn. 123456"
        />
      </label>

      <p v-if="error" class="form-error" role="alert">
        {{ error }}
      </p>

      <button type="submit" class="submit-button" :disabled="isSubmitting">
        <span v-if="!isSubmitting">Giriş Yap</span>
        <span v-else>Kontrol ediliyor...</span>
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const form = reactive({
  username: '',
  password: ''
});

const error = ref('');
const isSubmitting = ref(false);

watch(
  () => [form.username, form.password],
  () => {
    if (error.value) {
      error.value = '';
      auth.resetError();
    }
  }
);

const handleSubmit = () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  error.value = '';

  const success = auth.login({
    username: form.username,
    password: form.password
  });

  if (success) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : undefined;
    router.push(redirect ?? { name: 'home' });
  } else {
    error.value = auth.state.lastError;
  }

  isSubmitting.value = false;
};
</script>

<style scoped>
.login-wrapper {
  width: min(420px, 100%);
  padding: 2.5rem 2rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(6px);
  text-align: center;
}

.login-wrapper h1 {
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
  color: #0f172a;
}

.login-subtitle {
  margin-bottom: 2rem;
  color: #475569;
  line-height: 1.5;
}

.hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #2563eb;
}

.login-form {
  display: grid;
  gap: 1.5rem;
  text-align: left;
}

.form-field {
  display: grid;
  gap: 0.5rem;
  font-weight: 500;
  color: #0f172a;
}

.form-field input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #cbd5f5;
  background-color: #f8fafc;
  font-size: 1rem;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.form-field input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.form-error {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 12px;
}

.submit-button {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #f8fafc;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.submit-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(37, 99, 235, 0.25);
}
</style>
