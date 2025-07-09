export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: false,
  devtools: {
    enabled: true,
  },
  supabase: {
    url: 'https://your-supabase-url.supabase.co',
    key: 'your-anon-key',
  },
});
