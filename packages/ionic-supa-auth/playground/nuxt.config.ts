export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: false,
  devtools: {
    enabled: true,
  },
  supaAuth: {
    // Options for the Supabase Auth module
    supabase: {
      url: '',
      key: '',
    },
  },
});
