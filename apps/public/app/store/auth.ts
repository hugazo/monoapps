import type {
  User,
  Factor,
  AuthMFAEnrollTOTPResponse,
} from '@supabase/auth-js';

export default defineStore('auth', () => {
  const { auth } = useSupabaseClient();

  const fillUser = async () => {
    const { data, error } = await auth.getUser();
    if (error) {
      clearUser();
    }
    user.value = data.user;
    return data.user;
  };

  const clearUser = () => user.value = null;

  // Login status
  const user = ref <User | null>(null);
  const loggedIn = computed(() => user.value?.id ? true : false);

  // MFA
  const factors = ref<Factor[] | null>(null);
  const firstFactor = ref<AuthMFAEnrollTOTPResponse | null>(null);

  const $reset = () => {
    user.value = null;
    factors.value = null;
    firstFactor.value = null;
  };

  return {
    user,
    loggedIn,
    factors,
    firstFactor,
    fillUser,
    clearUser,
    $reset,
  };
});
