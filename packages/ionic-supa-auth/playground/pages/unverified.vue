<template>
  <div>
    <p>Unverified Only Page</p>
    <p>This page is only accessible for users without mfa.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  allowUnverified: true,
  title: 'Unverified Users Page',
});
</script>
