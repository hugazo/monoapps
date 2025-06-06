import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

// Module options TypeScript interface definition
export type ModuleOptions = object;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ionic-supa-auth',
    configKey: 'supaAuth',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(__dirname);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));
  },
});
