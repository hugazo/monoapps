import {
  defineNuxtModule,
  createResolver,
} from '@nuxt/kit';
import setupCommonModules from './setup/common';
import setupAuth from './setup/auth';
import setupMfa from './setup/mfa';

const defaultOptions = {
  // Default to false since Ionic requires client-side rendering
  enableSsr: false,
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
  },
  auth: {
    // Default options for the Supabase Auth module
    enabled: true,
    homePage: '/',
    loginPage: '/login',
    // 2fa settings
    enable2fa: true,
    verifyPage: '/verify',
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
    const resolver = createResolver(import.meta.url);
    // @nuxt/ionic, @nuxtjs/supabase, and @pinia/nuxt
    setupCommonModules(options, nuxt, resolver);

    if (options.auth.enabled) {
      // Executes the auth setup for the module
      // This will add the auth composable, middleware, and pages
      setupAuth(options, resolver);

      // Executes the 2FA setup for the module
      // This will add the 2FA composable, middleware, and pages
      if (options.auth.enable2fa) {
        // Push Both 2FA pages to the pages
        setupMfa(options, resolver);
      }
    }
  },
});
