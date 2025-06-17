import { installModule } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import type { ModuleOptions } from '../module';

export default async (options: ModuleOptions, nuxt: Nuxt) => {
  // Sets the project as only Client-side (Since Ionic Requires it)
  nuxt.options.ssr = options.enableSsr;

  // Add the Ionic Module to our Nuxt project
  await installModule('@nuxtjs/ionic', {
    css: {
      utilities: true,
    },
  });

  // Adds the supabase module to our Nuxt project
  await installModule('@nuxtjs/supabase', {
    // Use the public Supabase URL and Key from environment variables
    url: options.supabase.url,
    key: options.supabase.key,
    // Changes Options for Supabase Client Side and Auth
    redirect: false,
    useSsrCookies: false,
  });

  await installModule('@nuxt/image');

  await installModule('@pinia/nuxt');
};
