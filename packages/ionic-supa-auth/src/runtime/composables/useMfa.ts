import type { RouteLocationNormalizedGeneric } from 'vue-router';
import authStore from '../store/auth';
import { useAuth } from '../composables/useAuth';
import { useToast } from './useToast';
import {
  useSupabaseClient,
  callOnce,
  computed,
  useRuntimeConfig,
  useIonRouter,
  ref,
} from '#imports';

export default () => {
  const { auth } = useSupabaseClient();
  const state = authStore();
  const config = useRuntimeConfig();
  const router = useIonRouter();
  const { showErrorToast, showSuccessToast } = useToast();
  const {
    loadUser,
    loggedOutRedirect,
    getAuthRedirection,
  } = useAuth();

  const loading = ref(false);
  const selectedFactor = ref<number>(0);


  const loadFactors = async () => {
    loading.value = true;
    await loadUser();
    if (state.loggedIn === false) {
      loading.value = false;
      loggedOutRedirect();
    }

    const fetchedFactors = await auth.mfa.listFactors();
    if (fetchedFactors.error) {
      state.factors = [];
      loading.value = false;
      return null;
    }
    state.factors = fetchedFactors.data.all;
    if (availableFactors.value.length === 0) {
      await updateFirstFactor();
    }
    loading.value = false;
    return state.factors;
  };

  const initializeFactors = async () => {
    await callOnce('factors', () => loadFactors());
  };

  const availableFactors = computed(() => {
    return state.factors?.filter(factor => factor.status === 'verified') || [];
  });

  const firstFactor = computed(() => {
    return state.firstFactor ? true : false;
  });

  const factorIdToVerify = computed(() => {
    if (firstFactor.value) {
      return state.firstFactor?.id;
    }
    return state.factors ? state.factors[selectedFactor.value].id : null;
  });

  const updateFirstFactor = async () => {
    const unverifiedFactor = state.factors?.find(factor => factor.status === 'unverified' && factor.friendly_name === 'default');
    if (unverifiedFactor) {
      await auth.mfa.unenroll({
        factorId: unverifiedFactor.id,
      });
      const filteredFactors = state.factors?.filter(factor => factor.id !== unverifiedFactor.id);
      state.factors = filteredFactors || [];
    }
    const result = await auth.mfa.enroll({ factorType: 'totp', friendlyName: 'default' });
    if (result.data) {
      state.firstFactor = result.data;
    }
    return state.firstFactor;
  };

  const getAssuranceLevel = async () => await auth.mfa.getAuthenticatorAssuranceLevel();

  const unverifiedRedirect = async (to: RouteLocationNormalizedGeneric) => {
    // Route allows allows unverified users
    if (to.meta.allowUnverified) return true;
    // Redirect to verify page
    const redirect = getAuthRedirection(to);
    return router.push({
      path: config.public.verifyPage,
      query: {
        redirect,
      },
    });
  };

  const verifiedRedirect = async (to: RouteLocationNormalizedGeneric) => {
    // Route redirects if verified
    if (
      to.meta.allowUnverified
      || to.path === config.public.verifyPage
    ) {
      const path = getAuthRedirection(to);
      return router.push({
        path,
      });
    }
    // Route proceeds
    return true;
  };

  const handleVerification = async (code: string) => {
    if (factorIdToVerify.value) {
      const result = await auth.mfa.challengeAndVerify({
        factorId: factorIdToVerify.value,
        code,
      });
      if (result.data) {
        const path = getAuthRedirection();
        showSuccessToast('MFA verification successful');
        return router.push({
          path,
        });
      }
      if (result.error) {
        showErrorToast(result.error.message);
      }
    }
    else {
      throw new Error('No factor to verify');
    }
  };

  return {
    state,
    availableFactors,
    verifiedRedirect,
    unverifiedRedirect,
    getAssuranceLevel,
    initializeFactors,
    firstFactor,
    loading,
    handleVerification,
  };
};
