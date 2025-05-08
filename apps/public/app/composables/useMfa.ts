import authStore from '@/store/auth';

export default () => {
  const { auth } = useSupabaseClient();
  const state = authStore();

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

  return {
    factors,
    firstMfa,
    state,
    updateFirstFactor,
    enroll,
    verify,
  };
};
