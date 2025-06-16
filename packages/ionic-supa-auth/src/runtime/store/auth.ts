import type {
  User,
} from '@supabase/auth-js';
import {
  defineStore,
  ref,
  computed,
} from '#imports';

export default defineStore('auth', () => {
  // Login status
  const user = ref <User | null>(null);
  const loggedIn = computed(() => user.value?.id ? true : false);

  const $reset = () => {
    user.value = null;
  };

  return {
    user,
    loggedIn,
    $reset,
  };
});
