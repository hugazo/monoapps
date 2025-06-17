import {
  extendPages,
  addImports,
  updateRuntimeConfig,
  addRouteMiddleware,
} from '@nuxt/kit';
import type { Resolver } from '@nuxt/kit';
import type { ModuleOptions } from '../module';

export default (options: ModuleOptions, resolver: Resolver) => {
  const { resolve } = resolver;

  updateRuntimeConfig({
    public: {
      enrollPage: options.auth.enrollPage,
      verifyPage: options.auth.verifyPage,
    },
  });

  extendPages((pages) => {
    pages.push({
      name: 'enroll-page',
      path: options.auth.enrollPage,
      file: resolver.resolve('./runtime/pages/enroll-page.vue'),
      meta: {
        allowNonEnrolled: true,
        redirectIfAuthenticated: true,
      },
    });
    pages.push({
      name: 'verify-page',
      path: options.auth.verifyPage,
      file: resolver.resolve('./runtime/pages/verify-page.vue'),
      meta: {
        allowUnverified: true,
        redirectIfAuthenticated: true,
      },
    });
  });
  addImports({
    name: 'default',
    as: 'useMfa',
    from: resolver.resolve('./runtime/composables/useMfa'),
  });

  addRouteMiddleware({
    name: 'mfa.global',
    path: resolve('./runtime/middleware/01-mfa'),
    global: true,
  });
};
