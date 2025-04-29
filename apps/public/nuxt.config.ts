// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@mono/base-config'],
  modules: ['@nuxtjs/ionic'],
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/ionic.css'],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
});
