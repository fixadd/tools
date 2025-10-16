import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

export const authGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const auth = useAuth();

  if (to.meta.requiresAuth && !auth.state.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.name === 'login' && auth.state.isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  next();
};
