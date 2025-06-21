export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: false,
  devtools: {
    enabled: true,
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
    useSsrCookies: false,
  },
});
