import type { Resolver } from '@nuxt/kit';
import { installModule } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import type { ModuleOptions } from '../module';

export default async (options: ModuleOptions, nuxt: Nuxt, resolver: Resolver) => {
  // Sets the project as only Client-side (Since Ionic Requires it)
  nuxt.options.ssr = options.enableSsr as boolean;
  // State before ionic
  await installModule('@pinia/nuxt');

  // Add the Ionic Module to our Nuxt project
  await installModule('@nuxtjs/ionic', {
    css: {
      utilities: true,
    },
  });

  await installModule('@nuxtjs/tailwindcss', {
    configPath: resolver.resolve('./tailwind.config'),
    config: {
      content: [
        resolver.resolve('./**/*.{js,ts,vue}'),
        './src/runtime/**/*.{js,ts,vue}',
      ],
    },
    exposeConfig: true,
  });

  // Adds the supabase module to our Nuxt project
  await installModule('@nuxtjs/supabase', {
    // Changes Options for Supabase Client Side and Auth
    url: options?.supabase?.url as string,
    key: options?.supabase?.key as string,
    redirect: false,
    useSsrCookies: false,
  });

  await installModule('@nuxt/image');

  // Add zod 4 as Auto Imports
};
