import {
  addTypeTemplate,
  addRouteMiddleware,
  updateRuntimeConfig,
  extendPages,
  addImports,
} from '@nuxt/kit';
import type { Resolver } from '@nuxt/kit';

import type { ModuleOptions } from '../module';

// Auth Setup for the module
export default (options: ModuleOptions, resolver: Resolver) => {
  const { resolve } = resolver;
  // These will be used on the middleware and auth composable
  updateRuntimeConfig({
    public: {
      loginPage: options.auth.loginPage,
      homePage: options.auth.homePage,
    },
  });
  // Extends the #app types to support auth options in components
  addTypeTemplate({
    filename: 'types/ionic-supa-auth.d.ts',
    getContents: () => `declare module '#app' {
interface PageMeta {
allowUnauthenticated?: boolean;
redirectIfAuthenticated?: boolean;
allowNonEnrolled?: boolean;
allowUnverified?: boolean;
}
}`,
  });

  // This adds the login page
  extendPages((pages) => {
    pages.push({
      name: 'login-page',
      path: options.auth.loginPage,
      file: resolve('./runtime/pages/login-page.vue'),
      meta: {
        // Makes the login page public-only
        allowUnauthenticated: true,
        redirectIfAuthenticated: true,
      },
    });
  });

  // This exposes the auth composable to the app
  addImports({
    name: 'default',
    as: 'useAuth',
    from: resolve('./runtime/composables/useAuth'),
  });

  // This adds the auth middleware to the app
  addRouteMiddleware({
    name: 'auth.global',
    path: resolve('./runtime/middleware/00-auth'),
    global: true,
  });
};
