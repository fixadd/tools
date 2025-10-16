import { createRouter, createWebHistory } from 'vue-router';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import InventoryTrackingView from '@/views/InventoryTrackingView.vue';
import LicenseTrackingView from '@/views/LicenseTrackingView.vue';
import PrinterTrackingView from '@/views/PrinterTrackingView.vue';
import StockTrackingView from '@/views/StockTrackingView.vue';
import RequestTrackingView from '@/views/RequestTrackingView.vue';
import KnowledgeBaseView from '@/views/KnowledgeBaseView.vue';
import ScrapManagementView from '@/views/ScrapManagementView.vue';
import ProfileView from '@/views/ProfileView.vue';
import AdminPanelView from '@/views/AdminPanelView.vue';
import RecordsView from '@/views/RecordsView.vue';
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
      meta: { layout: 'auth', title: 'Giriş Yap' }
    },
    {
      path: '/',
      component: AuthenticatedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'ana-sayfa',
          name: 'home',
          component: HomeView,
          meta: { title: 'Ana Sayfa', requiresAuth: true }
        },
        {
          path: 'envanter-takip',
          name: 'inventory-tracking',
          component: InventoryTrackingView,
          meta: { title: 'Envanter Takip', requiresAuth: true }
        },
        {
          path: 'lisans-takip',
          name: 'license-tracking',
          component: LicenseTrackingView,
          meta: { title: 'Lisans Takip', requiresAuth: true }
        },
        {
          path: 'yazici-takip',
          name: 'printer-tracking',
          component: PrinterTrackingView,
          meta: { title: 'Yazıcı Takip', requiresAuth: true }
        },
        {
          path: 'stok-takip',
          name: 'stock-tracking',
          component: StockTrackingView,
          meta: { title: 'Stok Takip', requiresAuth: true }
        },
        {
          path: 'talep-takip',
          name: 'request-tracking',
          component: RequestTrackingView,
          meta: { title: 'Talep Takip', requiresAuth: true }
        },
        {
          path: 'bilgi-bankasi',
          name: 'knowledge-base',
          component: KnowledgeBaseView,
          meta: { title: 'Bilgi Bankası', requiresAuth: true }
        },
        {
          path: 'hurdalar',
          name: 'scrap-management',
          component: ScrapManagementView,
          meta: { title: 'Hurdalar', requiresAuth: true }
        },
        {
          path: 'profil',
          name: 'profile',
          component: ProfileView,
          meta: { title: 'Profil', requiresAuth: true }
        },
        {
          path: 'admin-paneli',
          name: 'admin-panel',
          component: AdminPanelView,
          meta: { title: 'Admin Paneli', requiresAuth: true }
        },
        {
          path: 'kayitlar',
          name: 'records',
          component: RecordsView,
          meta: { title: 'Kayıtlar', requiresAuth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'login' }
    }
  ]
});

router.beforeEach(authGuard);

export default router;
