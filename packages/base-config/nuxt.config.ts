// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
});
