import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import { authGuard } from '@/router/middleware';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' }
    },
    {
      path: '/giris',
      name: 'login',
      component: LoginView,
      meta: { layout: 'auth' }
    },
    {
      path: '/ana-sayfa',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'login' }
    }
  ]
});

router.beforeEach(authGuard);

export default router;
