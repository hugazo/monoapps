export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: false,
  devtools: {
    enabled: true,
  },
  supaAuth: {
    supabase: {
      url: process.env.NUXT_PUBLIC_SUPABASE_URL ? process.env.NUXT_PUBLIC_SUPABASE_URL : '',
      key: process.env.NUXT_PUBLIC_SUPABASE_KEY ? process.env.NUXT_PUBLIC_SUPABASE_KEY : '',
    },
  },
  supabase: {
    // url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    // key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
    useSsrCookies: false,
  },
});
