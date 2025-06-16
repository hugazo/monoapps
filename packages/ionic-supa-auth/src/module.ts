import {
  defineNuxtModule,
  // addPlugin,
  // createResolver,
  // addRouteMiddleware,
  installModule,
} from '@nuxt/kit';

// Module options TypeScript interface definition
export type ModuleOptions = object;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ionic-supa-auth',
    configKey: 'supaAuth',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    // const resolver = createResolver(import.meta.url);

    // Add the Ionic Module to our Nuxt project
    await installModule('@nuxtjs/ionic', {
      exposeConfig: true,
      config: {
        css: {
          utilities: true,
        },
      },
    });

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'));
  },
});
