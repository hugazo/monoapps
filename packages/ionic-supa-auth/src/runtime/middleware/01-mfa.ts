import useAuth from '../composables/useAuth';
import useMfa from '../composables/useMfa';
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
} from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (from.matched.length === 0) return;
  // First navigation, skips middleware to let the app load
  const {
    loggedOutRedirect,
    clearAuth,
    state,
  } = useAuth();
  const {
    verifiedRedirect,
    unverifiedRedirect,
    getAssuranceLevel,
  } = useMfa();
  const config = useRuntimeConfig();

  // Disable this for the login route
  if (to.path === config.public.loginPage) {
    return;
  }

  // We ensure to run this middleware only if the user is logged in
  if (state.loggedIn) {
    const assuranceLevel = await getAssuranceLevel();
    // Error cases
    if (
      // User not logged in or session expired
      (assuranceLevel === null || assuranceLevel.error)
      // Badly formed JWT
      || (assuranceLevel.data?.currentLevel === 'aal2' && assuranceLevel.data.nextLevel === 'aal1')
    ) {
      await clearAuth();
      return loggedOutRedirect();
    }
    // AAL2
    if (assuranceLevel.data?.currentLevel === 'aal2') {
      return verifiedRedirect(to);
    }
    // AAL1
    if (assuranceLevel.data?.currentLevel === 'aal1') {
      // Skips MFA check if the route allows unverified users
      return unverifiedRedirect(to);
    }
    // Route Allows unauthenticated access, skips MFA check
    // If we reach this point, the user is not enrolled or verified
    await clearAuth();
    return loggedOutRedirect();
  }
  return;
});
