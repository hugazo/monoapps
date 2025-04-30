// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@mono/base-config'],
  modules: [
    '@nuxtjs/ionic',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/ionic.css'],
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-01',
  ionic: {
    css: {
      utilities: true,
    },
  },
  supabase: {
    redirect: false,
  },
});