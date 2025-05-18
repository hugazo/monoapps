import { useIonRouter } from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { state, getAuthRedirection } = useSession();
  const router = useIonRouter();
  const client = useSupabaseClient();

  // Then fill the auth store on first load
  await callOnce('user', () => state.fillUser(), { mode: 'navigation' });

  // Checks if route allows for non authenticated users
  if (to.meta.allowUnauthenticated) {
    // Handles redirection if route disallows auth
    if (state.user && to.meta.redirectIfAuthenticated) {
      const path = getAuthRedirection(from);
      return router.navigate({
        path,
      });
    }
    return;
  };

  // User not logged redirection
  if (state.user === null) {
    return router.navigate({
      path: '/login',
      query: {
        redirect: to.path,
      },
    });
  }

  // Check redirect for users that don't have enabled 2fa at load time
  const assuranceLevel = await client.auth.mfa.getAuthenticatorAssuranceLevel();

  // Checks the assurance level for MFA
  if (assuranceLevel.data !== null) {
    // Current AAL1 means no factor enrolled or verified
    if (assuranceLevel.data.currentLevel === 'aal1') {
      // No factor enrolled
      if (
        assuranceLevel.data.nextLevel === 'aal1'
        && !to.meta.allowNonEnrolled
      ) {
        return router.navigate({
          path: '/enroll',
          query: {
            redirect: from.query.redirect,
          },
        });
      }
      if (
        assuranceLevel.data.nextLevel === 'aal2'
        && !to.meta.allowUnverified
      ) {
        const path = '/verify';
        if (to.path !== path) {
          return router.navigate({
            path,
            query: {
              redirect: from.query.redirect,
            },
          });
        }
      }
    }
    else if (assuranceLevel.data.currentLevel === 'aal2') {
      if (assuranceLevel.data.nextLevel === 'aal2') {
        // Disallows 2fa unenrolled and unverified routes
        if (to.meta.allowUnverified || to.meta.allowNonEnrolled) {
          const path = getAuthRedirection(from);
          return router.navigate({
            path,
          });
        }
        // This means the user has verified factors and can proceed to route
        return true;
      }
      else if (assuranceLevel.data.nextLevel === 'aal1') {
        // Badly formed JWT proceeds to clear user data and start login again
        console.error('Badly formed JWT, clearing user data');
        await useSupabaseClient().auth.signOut();
        state.clearUser();
        return router.navigate({
          path: '/login',
          query: {
            redirect: to.path,
          },
        });
      }
    }
  }
  else {
    // If assurance level data is null, it means the jwt was not set correctly
    console.error('Assurance level data is null, redirecting to login');
    await useSupabaseClient().auth.signOut();
    state.clearUser();
    return router.navigate({
      path: '/login',
      query: {
        redirect: to.path,
      },
    });
  }
});
