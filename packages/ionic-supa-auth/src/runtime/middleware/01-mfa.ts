import useAuth from '../composables/useAuth';
import useMfa from '../composables/useMfa';
import {
  defineNuxtRouteMiddleware,
} from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (from.matched.length === 0) return;
  // First navigation, skips middleware to let the app load
  const { loggedOutRedirect, clearAuth } = useAuth();
  const {
    verifiedRedirect,
    unverifiedRedirect,
    getAssuranceLevel,
  } = useMfa();

  const assuranceLevel = await getAssuranceLevel();
  // Route Allows unauthenticated access, skips MFA check
  if (to.meta.allowUnauthenticated) return;

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
    return unverifiedRedirect(to);
  }
  // If we reach this point, the user is not enrolled or verified
  await clearAuth();
  return loggedOutRedirect();
});
