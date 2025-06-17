import useAuth from '../composables/useAuth';
import {
  defineNuxtRouteMiddleware,
  callOnce,
  useIonRouter,
  useRuntimeConfig,
} from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // First navigation, skips middleware to let the app load
  if (from.matched.length === 0) return;

  const {
    state,
    loadUser,
    loggedInRedirect,
    loggedOutRedirect,
  } = useAuth();
  // Loads the user on first middleware call
  await callOnce('auth', () => loadUser(), { mode: 'navigation' });

  // Handles public routes
  if (to.meta.allowUnauthenticated) {
    if (state.loggedIn && to.meta.redirectIfAuthenticated) {
      // Public only route
      return loggedInRedirect();
    }
  }

  // Now we handle protected routes
  if (!state.loggedIn) {
    // User not logged redirection
    if (to.meta.allowUnauthenticated) {
      return;
    }
    return loggedOutRedirect(to);
  }
});
