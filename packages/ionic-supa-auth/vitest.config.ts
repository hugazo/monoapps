import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  // Enable Nuxt environment for testing
  test: {
    environment: 'nuxt',
    globals: true,
    environmentOptions: {
      nuxt: {
        rootDir: './playground',
      },
    },
  },
});
