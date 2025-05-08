import type { RouteLocationNormalizedGeneric } from 'vue-router';

import { z } from 'zod';
import authStore from '@/store/auth';

export default () => {
  const { auth } = useSupabaseClient();
  // const toast = useToast();
  const { currentRoute } = useRouter();
  const router = useIonRouter();

  const state = authStore();

  // Helper to be used in templates and to validate login
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const loginForm = useForm(loginSchema, {
    email: '',
    password: '',
  });

  // type LoginSchema = z.output<typeof loginSchema>;

  const handleLogin = async () => {
    loginForm.isSubmitting.value = true;
    if (!loginForm.validate()) {
      loginForm.isSubmitting.value = false;
      return;
    }
    const result = await auth.signInWithPassword(loginForm.data.value);
    if (result.error) {
      console.error('Login error', result.error);
    }
    loginForm.clearForm();
    await state.fillUser();
    loginForm.isSubmitting.value = false;
  };

  const logout = async () => {
    await auth.signOut();
    state.$reset();
  };

  // Helper for watcher
  const { loggedIn } = storeToRefs(state);

  // Watches for logged changes to trigger redirection
  watch(loggedIn, async (newValue, oldValue) => {
    // Triggers only when logged status changes
    if (newValue !== oldValue) {
      // User logs in
      if (newValue) {
        authRedirect();
      }
      // User logs out
      else {
        logoutRedirect();
      }
    }
  });

  const authRedirect = async () => {
    const path = getAuthRedirection(currentRoute.value);
    if (currentRoute.value.meta.redirectIfAuthenticated) {
      router.navigate({
        path,
      });
    }
  };

  const logoutRedirect = async () => {
    // Avoids redirect when page meta disables it
    if (currentRoute.value.meta.allowUnauthenticated) return;
    router.navigate({
      path: '/login',
      query: {
        redirect: currentRoute.value.path,
      },
    });
  };

  const getAuthRedirection = (route: RouteLocationNormalizedGeneric): string => {
    return typeof route.query.redirect === 'string' ? route.query.redirect : '/';
  };

  return {
    state,
    loginForm,
    handleLogin,
    getAuthRedirection,
    logout,
  };
};
