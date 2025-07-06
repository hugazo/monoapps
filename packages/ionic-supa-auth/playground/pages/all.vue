<template>
  <div>
    <p>All Allowed</p>
    <p>This page is accessible by everyone.</p>
    <p>It does not require authentication.</p>
    <p>You can use this page to test public access.</p>
    <p>Feel free to add more content here.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  allowUnauthenticated: true,
  title: 'Public Page',
});
</script>
