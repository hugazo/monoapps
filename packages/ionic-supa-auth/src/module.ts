import {
  defineNuxtModule,
  // addPlugin,
  createResolver,
  // addRouteMiddleware,
  installModule,
  addTypeTemplate,
  addRouteMiddleware,
  updateRuntimeConfig,
  extendPages,
  addImports,
} from '@nuxt/kit';

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
    loginPage: '/login',
    homePage: '/',
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
    const { resolve } = createResolver(import.meta.url);

    // Sets the project as only Client-side (Since Ionic Requires it)
    nuxt.options.ssr = options.enableSsr;

    // Add the Ionic Module to our Nuxt project
    await installModule('@nuxtjs/ionic', {
      css: {
        utilities: true,
      },
    });

    // Adds the supabase module to our Nuxt project
    await installModule('@nuxtjs/supabase', {
      // Use the public Supabase URL and Key from environment variables
      url: options.supabase.url,
      key: options.supabase.key,
      // Changes Options for Supabase Client Side and Auth
      redirect: false,
      useSsrCookies: false,
    });

    await installModule('@pinia/nuxt');

    if (options.auth.enabled) {
      updateRuntimeConfig({
        public: {
          loginPage: options.auth.loginPage,
          homePage: options.auth.homePage,
        },
      });
      // Extends the #app types to support auth options in components
      addTypeTemplate({
        filename: 'types/ionic-supa-auth.d.ts',
        getContents: () => `declare module '#app' {
  interface PageMeta {
    allowUnauthenticated?: boolean;
    redirectIfAuthenticated?: boolean;
    allowNonEnrolled?: boolean;
    allowUnverified?: boolean;
  }
}`,
      });

      extendPages((pages) => {
        // Adds the login page to the pages
        pages.push({
          name: 'login-page',
          path: options.auth.loginPage,
          file: resolve('./runtime/pages/login-page.vue'),
          meta: {
            // Makes the login page public-only
            allowUnauthenticated: true,
            redirectIfAuthenticated: true,
          },
        });
      });

      addImports({
        name: 'default',
        as: 'useAuth',
        from: resolve('./runtime/composables/useAuth'),
      });

      addRouteMiddleware({
        name: 'auth.global',
        path: resolve('./runtime/middleware/00-auth'),
        global: true,
      });
    }
  },
});
