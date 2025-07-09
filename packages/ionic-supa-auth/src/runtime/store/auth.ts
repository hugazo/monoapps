import type {
  User,
  Factor,
  AuthMFAEnrollTOTPResponse,
} from '@supabase/auth-js';
import { defineStore } from 'pinia';
import {
  ref,
  computed,
} from '#imports';

export default defineStore('auth', () => {
  // Session status
  const user = ref <User | null>(null);
  const loggedIn = computed(() => user.value?.id ? true : false);

  const $reset = () => {
    user.value = null;
    factors.value = null;
    firstFactor.value = null;
  };

  // MFA
  const factors = ref<Factor[] | null>(null);
  const firstFactor = ref<AuthMFAEnrollTOTPResponse['data'] | null>(null);

  return {
    user,
    loggedIn,
    factors,
    firstFactor,
    $reset,
  };
});
