import type { RouteLocationNormalizedGeneric } from 'vue-router';

export const getAuthRedirection = (route: RouteLocationNormalizedGeneric): string =>
  typeof route.query.redirect === 'string' ? route.query.redirect : '/';
