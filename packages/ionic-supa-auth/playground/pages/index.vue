<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Welcome to Nuxt 3 with Ionic!</h1>
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
