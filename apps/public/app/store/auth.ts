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

  return {
    user,
    loggedIn,
    factors,
    firstFactor,
    fillUser,
    clearUser,
  };
});
