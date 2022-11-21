<template>
  <a-row>
    <a-col span="12" offset="6">
      <a-form
        name="basicLogin"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="email"
          label="Introduce tu email"
          :rules="[
            {
              required: true,
              type: 'email',
              whitespace: true,
              message: 'Por favor, introduce un correo',
            },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item
          name="password"
          label="Introduce tu contraseña"
          :rules="[
            {
              required: true,
              min: 6,
              message:
                'Por favor, introduce una contraseña con mínimo 6 carácteres',
              whitespace: true,
            },
          ]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="userStore.loadingUser"
          >
            Login
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'
import { async } from '@firebase/util'
import { message } from 'ant-design-vue'

const router = useRouter()
const formState = reactive({
  email: '',
  password: '',
})

const userStore = useUserStore()

const onFinish = async (values) => {
  console.log('Success:', values)
  const response = await userStore.loginUser(
    formState.email,
    formState.password,
  )  
  
  if (!response) {
    return message.success('Bienvenido a nuestra web')
  }
  switch (response) {
    case 'auth/user-not-found':
      message.error('Esta cuenta no existe')
      break
    case 'auth/wrong-password':
      message.error('contraseña incorrecta')

    default:
      message.error(
        'Falló algo desde la base de datos, intentelo de nuevo más tarde',
      )
  }
  

}
const onFinishFailed = async (errorInfo) => {
  console.log('Failed:', errorInfo)
}
</script>

<style></style>
