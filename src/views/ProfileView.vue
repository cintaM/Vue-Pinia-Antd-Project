<template>
  <div>
    <h1>Profile</h1>
    <a-avatar class="avatar" :src="userStore.userData.photoURL"/>
    <a-row>
      <a-col span="12" offset="6">
        <a-form
          name="basicProfile"
          autocomplete="off"
          layout="vertical"
          :model="userStore.userData"
          @finish="onFinish"
        >
          <a-form-item
            name="email"
            label="Tu email (no modificable)"
            :rules="[
              {
                required: true,
                type: 'email',
                whitespace: true,
                message: 'Por favor, introduce un correo',
              },
            ]"
          >
            <a-input disabled v-model:value="userStore.userData.email" />
          </a-form-item>
          <a-form-item
            name="displayName"
            label="Introduce tu nombre"
            :rules="[
              {
                required: true,
                whitespace: true,
                message: 'Por favor, introduce tu nombre',
              },
            ]"
          >
            <a-input v-model:value="userStore.userData.displayName" />
          </a-form-item>

          <a-upload
          v-model:file-list="fileList"
          list-type="picture"
          :before-upload="beforeUpload"
          :max-count="1"
          @change="handleChange">
          <a-button>
            <upload-outlined></upload-outlined>
            Subir foto de perfil
          </a-button>

          </a-upload>
        <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="margin-top: 16px"
        >


        </a-button>
          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button
              type="primary"
              large
              html-type="submit"
              :disabled="userStore.loadingUser"
              :loading="userStore.loadingUser"
            >
              Update Profile
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { message } from 'ant-design-vue'
import { ref } from 'vue';
const route = useRoute()
const userStore = useUserStore()
const fileList = ref([])


const beforeUpload = (file) => {
    fileList.value = [...fileList, file]
    return false
}

const handleChange = (info) => {
    if(info.file.status !== 'uploading'){
        const isPngorJpg = info.file.type ==="image/jpg" || info.file.type ==="image/png"
        if(!isPngorJpg){
            message.error('solo imagenes jpg o png')
            handleRemove(info.file)
            return
        }
        const isLt2M = info.file.size/ 1024 /1024 < 2;
        if(!isLt2M){
            message.error('máximo 2MB');
            handleRemove(info.file)
            return
        }
    }
    let resFileList = [...info.fileList]
    resFileList = resFileList.slice(-1)
    resFileList = resFileList.map((file) => {
        if(file.response){
            file.url = file.response.url
        }
        return file
    })
    fileList.value = resFileList
}

const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1)
    fileList.value = newFileList
}

const onFinish = async () => {
  const response = await userStore.updateUser(userStore.userData.displayName, fileList.value[0])

  if (!response) {
    return message.success('se actualizó tu información de perfil')
  }
  message.error('ocurrió un error al actualizar el perfil')
}
</script>
<style>

</style>
