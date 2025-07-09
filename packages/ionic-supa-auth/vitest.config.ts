import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  // Enable Nuxt environment for testing
  test: {
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
});
