<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="q-gutter-md col-xs-12 col-sm-7 col-lg-5">
      <InformationComponent />
      <UpdatePasswordComponent />
      <TwoFactorComponent />
      <DeleteAccountComponent />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import InformationComponent from 'components/Profile/InformationComponent.vue'
import UpdatePasswordComponent from 'src/components/Profile/UpdatePasswordComponent.vue'
import TwoFactorComponent from 'src/components/Profile/TwoFactorComponent.vue'
import DeleteAccountComponent from 'components/Profile/DeleteAccountComponent.vue'
</script>
