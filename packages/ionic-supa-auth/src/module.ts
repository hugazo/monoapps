import {
  defineNuxtModule,
  // addPlugin,
  // createResolver,
  // addRouteMiddleware,
  installModule,
} from '@nuxt/kit';

const defaultOptions = {
  // Default to false since Ionic requires client-side rendering
  enableSsr: false,
  supabase: {
    url: '',
    key: '',
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
    // const resolver = createResolver(import.meta.url);

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

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'));
  },
});
