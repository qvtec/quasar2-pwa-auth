<template>
  <q-page class="row items-center justify-evenly">
    <q-card flat bordered v-if="user">
      <q-item>
        <q-item-section avatar>
          <q-avatar v-if="user.photo"><q-img :src="user.photo" /></q-avatar>
          <q-avatar v-else icon="face" color="secondary" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
          <q-item-label caption>{{ user.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth'
const { user } = useAuthStore()
</script>
