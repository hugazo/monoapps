import type { RouteLocationNormalizedGeneric, RouteRecordNormalized } from 'vue-router';
import { z } from 'zod/v4';
import { useForm } from '../composables/useForm';
import authStore from '../store/auth';
import {
  useSupabaseClient,
  useRuntimeConfig,
  watch,
  storeToRefs,
  useRouter,
  useIonRouter,
} from '#imports';

export const useAuth = () => {
  const state = authStore();
  const config = useRuntimeConfig();
  const { currentRoute } = useRouter();
  const router = useIonRouter();

  const { auth } = useSupabaseClient();

  const loadUser = async () => {
    const { data, error } = await auth.getUser();
    if (error) {
      state.$reset();
    }
    state.user = data.user;
    return data.user;
  };

  // Helper to be used in templates and to validate login
  const loginSchema = z.object({
    email: z.email(),
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
      // TODO: Implement error handling for client
      console.error('Login error', result.error);
    }
    loginForm.clearForm();
    state.user = result.data.user;
    loginForm.isSubmitting.value = false;
  };

  const handleLogout = async () => {
    state.$reset();
    await auth.signOut();
  };

  const { loggedIn } = storeToRefs(state);

  watch(loggedIn, async (newValue, oldValue) => {
    // Triggers only when logged status changes
    if (newValue !== oldValue) {
      if (newValue) {
        loggedInRedirect();
      }
      else {
        loggedOutRedirect();
      }
    }
  });

  const loggedOutRedirect = (destinationRoute?: RouteLocationNormalizedGeneric) => {
    // Allows navigation when page meta allows unauthenticated users
    if (destinationRoute?.meta.allowUnauthenticated) return;
    // The route is protected, redirect to login
    return router.navigate({
      path: config.public.loginPage,
      query: {
        redirect: currentRoute.value.path,
      },
      replace: true,
    });
  };

  const loggedInRedirect = () => {
    const path = getAuthRedirection(currentRoute.value);
    if (currentRoute.value.meta.redirectIfAuthenticated) {
      return router.navigate({
        path,
      });
    }
  };

  const getAuthRedirection = (route: RouteLocationNormalizedGeneric): string => {
    return typeof route.query.redirect === 'string' ? route.query.redirect : config.public.homePage;
  };

  const clearAuth = async () => {
    await handleLogout();
    return loggedOutRedirect();
  };

  return {
    state,
    loadUser,
    loginForm,
    handleLogin,
    handleLogout,
    loggedOutRedirect,
    loggedInRedirect,
    clearAuth,
  };
};

export default useAuth;
