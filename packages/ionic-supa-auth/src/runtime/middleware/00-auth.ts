import useAuth from '../composables/useAuth';

import {
  defineNuxtRouteMiddleware,
} from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // First navigation, skips middleware to let the app load
  if (from.matched.length === 0) {
    console.log('Skipping auth middleware on first navigation');
    return;
  }

  const {
    state,
    initalizeAuth,
    loggedInRedirect,
    loggedOutRedirect,
  } = useAuth();
  // Loads the user on first middleware call
  await initalizeAuth();

  // Now we handle protected routes
  // Handles public routes
  if (to.meta.allowUnauthenticated) {
    if (state.loggedIn && to.meta.redirectIfAuthenticated) {
      // Public only route
      return loggedInRedirect();
    }
    return;
  }

  if (!state.loggedIn) {
    // User not logged redirection
    return loggedOutRedirect(to);
  }
});
