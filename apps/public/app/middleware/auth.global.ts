import { useIonRouter } from '#imports';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { state, getAuthRedirection } = useSession();
  const router = useIonRouter();
  // const client = useSupabaseClient();

  // Then fill the auth store on first load
  await callOnce('user', () => state.fillUser());

  // Checks if route allows for non authenticated users
  if (to.meta.allowUnauthenticated) {
    // Handles redirection if route disallows auth
    if (state.user && to.meta.redirectIfAuthenticated) {
      const path = getAuthRedirection(from);
      return router.push({
        path,
      });
    }
    return;
  };

  // User not logged redirection
  if (state.user === null) {
    return router.push({
      path: '/login',
      query: {
        redirect: to.path,
      },
    });
  }
});
