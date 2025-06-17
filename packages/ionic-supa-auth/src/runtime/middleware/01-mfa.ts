import useAuth from '../composables/useAuth';
import useMfa from '../composables/useMfa';
import {
  defineNuxtRouteMiddleware,
} from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // First navigation, skips middleware to let the app load
  if (from.matched.length === 0) return;
  // Route Allows unauthenticated access, skips MFA check
  if (to.meta.allowUnauthenticated) return;

  const { loggedInRedirect, clearAuth } = useAuth();
  const { enrollRedirect, verifyRedirect, getAssuranceLevel } = useMfa();
  // const router = useIonRouter();

  const assuranceLevel = await getAssuranceLevel();

  // Malformed JWT or no session
  if (assuranceLevel === null || assuranceLevel.error) {
    return await clearAuth();
  }
  if (assuranceLevel.data?.currentLevel === 'aal1') {
    if (assuranceLevel.data.nextLevel === 'aal1') {
      // User not enrolled mfa, redirecting to enroll page
      return enrollRedirect(to);
    }
    else if (assuranceLevel.data.nextLevel === 'aal2') {
      // User has enrolled mfa but not verified
      return verifyRedirect(to);
    }
  }
  else if (assuranceLevel.data?.currentLevel === 'aal2') {
    if (assuranceLevel.data.nextLevel === 'aal2') {
      // Prevents navigation to 2FA pages if already verified, redirects
      if (to.meta.allowUnverified || to.meta.allowNonEnrolled) {
        // User already verified mfa
        return loggedInRedirect();
      }
      // At this point the user has verified mfa and can proceed to route
      return true;
    }
    else if (assuranceLevel.data.nextLevel === 'aal1') {
      // Badly formed JWT
      return await clearAuth();
    }
  }
  // If we reach this point, the user is not enrolled or verified
  return false;
});
