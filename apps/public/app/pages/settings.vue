<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <template #start>
          <ion-buttons>
            <ion-back-button default-href="#" />
          </ion-buttons>
        </template>
        <ion-title>Display</ion-title>
        <template #end>
          <ion-buttons>
            <ion-button color="dark">
              <template #icon-only>
                <ion-icon

                  :ios="personCircleOutline"
                  :md="personCircle"
                />
              </template>
            </ion-button>
          </ion-buttons>
        </template>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list-header>Appearance</ion-list-header>
      <ion-list :inset="true">
        <ion-item :button="true">
          Text Size
        </ion-item>
        <ion-item>
          <ion-toggle justify="space-between">
            Bold Text
          </ion-toggle>
        </ion-item>
      </ion-list>

      <ion-list-header>Brightness</ion-list-header>
      <ion-list :inset="true">
        <ion-item>
          <ion-range :value="40">
            <template #start>
              <ion-icon :icon="sunnyOutline" />
            </template>
            <template #end>
              <ion-icon :icon="sunny" />
            </template>
          </ion-range>
        </ion-item>
        <ion-item>
          <ion-toggle
            justify="space-between"
            checked
          >
            True Tone
          </ion-toggle>
        </ion-item>
      </ion-list>

      <ion-list :inset="true">
        <ion-item :button="true">
          <ion-label>Night Shift</ion-label>
          <template #end>
            <ion-text
              color="medium"
            >
              9:00 PM to 8:00 AM
            </ion-text>
          </template>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { personCircle, personCircleOutline, sunnyOutline, sunny } from 'ionicons/icons';
</script>

<style>
  /* (Optional) This is added to prevent the flashing that happens when toggling between palettes */
  ion-item {
    --transition: none;
  }
</style>
