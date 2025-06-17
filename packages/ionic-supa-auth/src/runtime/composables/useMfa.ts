import type { RouteLocationNormalizedGeneric } from 'vue-router';
// TODO: Fix store
import authStore from '../store/auth';
import {
  useSupabaseClient,
  useAsyncData,
  computed,
  useRuntimeConfig,
  useIonRouter,
} from '#imports';

export default () => {
  const { auth } = useSupabaseClient();
  const state = authStore();
  const config = useRuntimeConfig();
  const router = useIonRouter();

  const factors = useAsyncData('factors', async () => {
    if (state.loggedIn) {
      const fetchedFactors = await auth.mfa.listFactors();
      if (fetchedFactors.error) {
        state.factors = null;
        return null;
      }
      state.factors = fetchedFactors.data.all;
      return state.factors;
    }
    return null;
  });

  const firstMfa = computed(() => {
    const allFactors = state.factors;

    return allFactors?.find(factor => factor.status === 'unverified' && factor.friendly_name === 'default') || false;
  });

  const updateFirstFactor = async () => {
    if (state.loggedIn) {
      // First we load the factors
      await factors.execute();
      // Check if there is already created a default MFA factor an unenrolls it
      if (firstMfa.value && !state.firstFactor) {
        await auth.mfa.unenroll({
          factorId: firstMfa.value.id,
        });
      }
      // Enrolls the new factor to obtain the QR data
      const result = await auth.mfa.enroll({ factorType: 'totp', friendlyName: 'default' });
      if (result.data) {
        state.firstFactor = result;
        return state.firstFactor;
      }
      return null;
    }
    return null;
  };

  const getAssuranceLevel = async () => await auth.mfa.getAuthenticatorAssuranceLevel();

  const verify = async (code: string, factorId: string) => {
    if (state.loggedIn) {
      const result = await auth.mfa.challengeAndVerify({
        factorId,
        code: code,
      });
      return result;
    }
    return null;
  };

  const enroll = async (code: string) => {
    if (state.loggedIn) {
      if (state.firstFactor?.data?.id) {
        const result = await auth.mfa.challengeAndVerify({
          factorId: state.firstFactor.data.id,
          code: code,
        });
        return result;
      }
      else {
        throw new Error('No factor data available');
      }
    }
    return null;
  };

  const verifyRedirect = async (to: RouteLocationNormalizedGeneric) => {
    // Route allows allows unverified users
    if (to.meta.allowUnverified) return;
    // Redirect to verify page
    return router.navigate({
      path: config.public.verifyPage,
      query: {
        redirect: to.query.redirect,
      },
      replace: true,
    });
  };

  const enrollRedirect = (to: RouteLocationNormalizedGeneric) => {
    // Route allows non-enrolled users
    if (to.meta.allowNonEnrolled) return;
    // Redirect to enroll page
    return router.navigate({
      path: config.public.enrollPage,
      query: {
        redirect: to.query.redirect,
      },
      replace: true,
    });
  };

  return {
    factors,
    firstMfa,
    state,
    updateFirstFactor,
    enroll,
    verify,
    verifyRedirect,
    enrollRedirect,
    getAssuranceLevel,
  };
};
