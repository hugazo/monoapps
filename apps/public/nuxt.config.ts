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
  devtools: { enabled: true },
  css: [
    '~/assets/css/ionic.css',
  ],
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
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
    useSsrCookies: false,
  },
});
