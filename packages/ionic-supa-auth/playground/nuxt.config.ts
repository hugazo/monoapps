export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  supaAuth: {
    // Options for the Supabase Auth module
    supabase: {
      url: '',
      key: '',
    },
  },
});
