<template>
  <q-card flat bordered>
    <q-card-section class="bg-grey-2">
      <div class="text-h6">プロフィール</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-if="!!path">
        <q-avatar size="100px">
          <q-img :src="path" />
        </q-avatar>
        <div align="center" class="q-pt-sm" style="width:100px">
          <q-btn label="削除" @click="deletePhoto" />
        </div>
      </div>
      <div v-else>
        <q-avatar v-if="!!uploadImage" size="100px">
          <q-img :src="uploadImage" />
        </q-avatar>
        <q-avatar v-else icon="face" color="secondary" text-color="white" size="100px" font-size="80px" />
        <q-file
          :model-value="photo"
          @update:model-value="updateFiles"
          label="写真"
          clearable
          dense
          style="max-width: 300px"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <q-input
          outlined
          hide-bottom-space
          v-model="name"
          label="Name"
          lazy-rules
          :rules="[val => !!val || '入力してください']"
        >
          <template v-slot:prepend>
            <q-icon name="account_circle" />
          </template>
        </q-input>

        <q-input
          outlined
          hide-bottom-space
          v-model="email"
          label="Email"
          type="email"
          lazy-rules
          :rules="[val => !!val || '入力してください']"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>

        <div>
          <q-btn
            label="更新"
            :loading="loading"
            type="submit"
            color="secondary"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import { api } from 'boot/axios'
import loadImage from 'blueimp-load-image'

const $q = useQuasar()
const $authStore = useAuthStore()

const loading = ref(false)
const photo = ref(null)
const name = ref('')
const email = ref('')
const path = ref<string | null>('')
const uploadImage = ref('')

onMounted(() => {
  const user = $authStore.user
  if (!user) return
  name.value = user.name
  email.value = user.email
  path.value = user.photo
})

const onSubmit = () => {
  loading.value = true

  const params = {
    'photo': photo.value,
    'name': name.value,
    'email': email.value
  }

  api.put('user/profile-information', params)
    .then(() => {
      $authStore.setUser()
      $q.notify({ type: 'positive', message: '更新完了しました' })
    })
    .finally(() => {
      loading.value = false
    })
}

const deletePhoto = async() => {
  await api.delete('user/profile-photo')
  await $authStore.setUser()
  path.value = null
}

const updateFiles = (file: File) => {
  uploadImage.value = ''
  if (!file) return

  loadImage.parseMetaData(file, (data: loadImage.MetaData) => {
    const options: loadImage.LoadImageOptions = {
      maxHeight: 1920,
      maxWidth: 1920,
      canvas: true
    }

    if (data.exif) {
      options.orientation = data.exif.get('Orientation') as loadImage.Orientation
    }

    displayImage(file, options)
  })
}

async function displayImage (file: File, options: loadImage.LoadImageOptions) {
  const result = await loadImage(file,  options)
  const canvas = (result.image as HTMLCanvasElement)
  const data = canvas.toDataURL(file.type)
  const blob = base64ToBlob(data, file.type)
  const url = window.URL.createObjectURL(blob)
  uploadImage.value = url
  savePhoto(blob)
}

function savePhoto (blob: Blob) {
  const fd = new FormData()
  fd.append('photo', blob)
  fd.append('name', name.value)
  fd.append('email', email.value)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-HTTP-Method-Override': 'PUT'
    }
  }

  api.post('user/profile-information', fd, config)
    .then(() => {
      $authStore.setUser()
      $q.notify({ type: 'positive', message: '更新完了しました' })
    })
    .finally(() => {
      loading.value = false
    })
}

function base64ToBlob (base64: string, fileType: string) {
  const bin = atob(base64.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  return new Blob([buffer.buffer], {
    type: fileType != null ? fileType : 'image/png'
  })
}
</script>
