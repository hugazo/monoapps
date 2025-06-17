import {
  defineNuxtModule,
  // addPlugin,
  createResolver,
} from '@nuxt/kit';
import setupCommonModules from './setup/common';
import setupAuth from './setup/auth';

const defaultOptions = {
  // Default to false since Ionic requires client-side rendering
  enableSsr: false,
  supabase: {
    url: '',
    key: '',
  },
  auth: {
    // Default options for the Supabase Auth module
    enabled: true,
    homePage: '/',
    loginPage: '/login',
    // 2fa settings
    enrollUrl: '/enroll',
    enable2fa: true,
    verifyUrl: '/verify',
  },
};

// Module options TypeScript interface definition
export type ModuleOptions = typeof defaultOptions;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ionic-supa-auth',
    configKey: 'supaAuth',
  },
  // Default configuration options of the Nuxt module
  defaults: defaultOptions,
  async setup(options, nuxt) {
    // Sets up the needed modules for this integration
    // @nuxt/ionic, @nuxtjs/supabase, and @pinia/nuxt
    setupCommonModules(options, nuxt);

    if (options.auth.enabled) {
      const resolver = createResolver(import.meta.url);
      // Executes the auth setup for the module
      // This will add the auth composable, middleware, and pages
      setupAuth(options, resolver);
    }
  },
});
