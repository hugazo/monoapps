<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="flex flex-col h-full items-center justify-center">
      <h1 class="text-2xl font-bold mb-4  ">
        Welcome to Nuxt 3 with Ionic!
      </h1>
      <p>This is a simple starter page.</p>
      <ion-button @click="handleLogout()">
        Logout
      </ion-button>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title>Footer</ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
const { handleLogout } = useAuth();
// This page should be protected by the supa-auth module, and only accessible to authenticated users.
// If the user is not authenticated, they should be redirected to the login page.
</script>
