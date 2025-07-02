<!--
Get your module up and running quickly.

// What this module injects
// How to use it
// How to contribute

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# My Module

<!-- TODO: Get the public npm address -->
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Module Auto Injection
  - `@pinia/nuxt`
  - `@nuxtjs/ionic`
  - `@nuxtjs/tailwindcss`
  - `@nuxtjs/supabase`
  - `@nuxt/image`
- Automatic Setup
  - Auth
    - Adds `useAuth` composable
    - Adds auth middleware
    - Adds login page
  - MFA
    - Adds `useMfa` composable
    - Adds mfa middleware
    - Adds mfa pages

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add my-module
```

That's it! You can now use My Module in your Nuxt app ✨

## Module Usage

### Installation

Add the module to your `nuxt.config.ts` file:

```ts
export default defineNuxtConfig({
  modules: [
    '@monoapps/ionic-supa-auth',
  ],
  myModule: {
    // Module options
  }
})
```

### Supabase Configuration

Add your Supabase URL and Key to your environment variables:

```bash
# .env
NUXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-supabase-key
```

## Module Options

You can configure the module by passing options in your `nuxt.config.ts` file:

- `enableSsr`
  - Type: `boolean`
  - Default: `false`
  - Description: Enable server-side rendering for the module. Set to `true` if you want to use SSR.

    Since builds of iOS or Android are pure client-side, it is recommended to keep this option `false` for mobile applications.
- `supabase`
  - Description: Supabase configuration object.
  - `url`: `string`
    - Default: `process.env.NUXT_PUBLIC_SUPABASE_URL`
    - Description: The URL of your Supabase instance. This can be provided via environment variables.
  - `key`: `string`
    - Default: `process.env.NUXT_PUBLIC_SUPABASE_KEY`
    - Description: The public key for your Supabase instance. This can be provided via environment variables.
- `auth`
  - Description: Authentication configuration object.
  - `enabled`: `boolean`
    - Default: `true`
    - Description: Enable authentication for the module. Disabling this will skip all auth and mfa middlewares, composables and pages.
  - `homePage`: `string`
    - Default: `'/`
    - Description: The home page to redirect to after login or verification.
  - `loginPage`: `string`
    - Default: `'/login`
    - Description: The login page URL.
  - `enable2fa`: `boolean`
    - Default: `true`
    - Description: Enable two-factor authentication.

      If disabled, MFA won't be used. This has effect on how to use supabase database directly. For further information, refer to the [Supabase documentation](https://supabase.com/docs/guides/database/postgres/row-level-security#enabling-row-level-security).
  - `verifyPage`: `string`
    - Default: `'/verify`
    - Description: The verification page URL.

## Auth Options

You can configure your Authentication directly in your Page files. The needed types are already imported, so you can use them directly in your `<script setup>` block.

### Public Page

```vue
<script setup lang="ts">
definePageMeta({
  allowUnauthenticated: true,
  title: 'Public Page',
});
</script>
```

### Only Non-Authenticated Page

```vue
<script setup lang="ts">
definePageMeta({
  allowUnauthenticated: true,
  redirectIfAuthenticated: true,
  title: 'Non-authenticated Only Page',
});
</script>
```

### Unverified Pages

```vue
<script setup lang="ts">
definePageMeta({
  allowUnverified: true,
  title: 'Unverified Users Page',
});
</script>
```

Important: All other routes will be treated as protected by the module config, if you have auth and mfa enabled, the page will require authentication and verification by default.

## Using Ionic

Since this module will handle the Ionic Nuxt module installation, you can config this module according to the [Ionic Nuxt documentation](https://ionic.nuxtjs.org/get-started/configuration).

### iOS and Android Applications

For iOS and Android applications, capacitor needs to be enabled, please follow the [Ionic Nuxt documentation](https://ionic.nuxtjs.org/get-started/enabling-capacitor) to set up your application.

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
