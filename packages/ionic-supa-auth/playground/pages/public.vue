<template>
  <div>
    <p>Public Only Page</p>
    <p>This page is only accessible without authentication.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  allowUnauthenticated: true,
  redirectIfAuthenticated: true,
  title: 'Public Only Page',
});
</script>
