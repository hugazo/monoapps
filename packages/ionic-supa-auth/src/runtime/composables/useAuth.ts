import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { z } from 'zod/v4';
import { storeToRefs } from 'pinia';
import { useForm } from '../composables/useForm';
import useAuthStore from '../store/auth';
import { useToast } from './useToast';

import {
  useSupabaseClient,
  useSupabaseUser,
  useRuntimeConfig,
  watch,
  useRouter,
  useIonRouter,
  callOnce,
  usePinia,
} from '#imports';

export const useAuth = () => {
  const pinia = usePinia();

  const state = useAuthStore(pinia);
  const config = useRuntimeConfig();
  const { currentRoute } = useRouter();
  const router = useIonRouter();
  const { auth } = useSupabaseClient();
  const { showErrorToast, showSuccessToast } = useToast();

  const loadUser = async () => {
    const user = useSupabaseUser();
    if (user.value) {
      state.user = user.value;
      return user.value;
    }
    state.$reset();
    return null;
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

  // TODO: Handle schema validation on form

  // type LoginSchema = z.output<typeof loginSchema>;

  const handleLogin = async () => {
    loginForm.isSubmitting.value = true;
    if (!loginForm.validate()) {
      loginForm.isSubmitting.value = false;
      return;
    }
    const result = await auth.signInWithPassword(loginForm.data.value);
    if (result.error) {
      showErrorToast(result.error.message);

      loginForm.isSubmitting.value = false;
      return;
    }
    if (result.data) {
      showSuccessToast('Login successful');
      // Clear the form after successful login
      loginForm.clearForm();
      state.user = result.data.user;
      loginForm.isSubmitting.value = false;
    }
  };

  const handleLogout = async () => {
    state.$reset();
    await auth.signOut();
    await showSuccessToast('Logged out successfully');
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
    if (
      // Allows navigation to the login page
      destinationRoute?.path === config.public.loginPage
      // Allows navigation when page meta allows unauthenticated users
      || destinationRoute?.meta.allowUnauthenticated
    ) return;
    // The route is protected, redirect to login
    return router.push({
      path: config.public.loginPage,
      query: {
        redirect: currentRoute.value.path,
      },
    });
  };

  const loggedInRedirect = () => {
    const path = getAuthRedirection(currentRoute.value);
    if (currentRoute.value.meta.redirectIfAuthenticated) {
      return router.push({
        path,
      });
    }
  };

  const getAuthRedirection = (route?: RouteLocationNormalizedGeneric): string => {
    const redirect = route?.query.redirect;
    if (
      redirect === config.public.loginPage
      || redirect === config.public.verifyPage
    ) {
      return config.public.homePage;
    }
    return typeof redirect === 'string' ? redirect : config.public.homePage;
  };

  const clearAuth = async () => {
    await handleLogout();
    return loggedOutRedirect();
  };

  const initalizeAuth = async () => {
    await callOnce('auth', () => loadUser());
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
    initalizeAuth,
    getAuthRedirection,
  };
};

export default useAuth;
