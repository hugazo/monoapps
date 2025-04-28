// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@mono/base-config'],
  css: ['~/assets/css/ionic.css'],
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/ionic'],
  ssr: false,
})
