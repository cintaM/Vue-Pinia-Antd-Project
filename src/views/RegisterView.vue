<template>

<a-row>
    <a-col span="12" offset="6">
      <a-form
        name="basicRegister"
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
              whitespace:true,
              message: 'Por favor, introduce un correo',
            },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item name="password"
          label="Introduce tu contraseña"
          :rules="[
            {
              required: true,
              min: 6,
              message: 'Por favor, introduce una contraseña con mínimo 6 carácteres',
              whitespace:true,
            },
          ]">
        <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item 
        name="password2"
          label="Repita la contraseña"
          :rules="[
            {
              required: true,
              validator: validatePass
            },
          ]">
        <a-input-password v-model:value="formState.password2" />
        </a-form-item>
        <a-form-item :wrapper-col="{offset: 8, span: 16}" >
            <a-button type="primary" html-type="submit" :disabled="userStore.loadingUser">Register</a-button>

        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>
<script setup>
import {ref, reactive} from 'vue'
import { useUserStore } from '../store/user';
import { message } from 'ant-design-vue'


const userStore = useUserStore()

const formState = reactive({
    email:'',
    password:'',
    password2:''
})

const validatePass = async(_rule, value) => {
    if(value === ''){
        return Promise.reject('Repita contraseña')
    }
    if(value !== formState.password){
        return Promise.reject('No coinciden las contraseñas')
    }
    return Promise.resolve()
}
const onFinish = async(values) => {
    console.log('Success', values );
    const response = await userStore.registerUser(formState.email, formState.password)
    if (!response) {
    return message.success('Revisa tu correo y verifica tu cuenta')
  }
  switch (response) {
    case 'auth/email-already-in-use':
      message.error('Esta cuenta ya está registrada')
      break;

    default:
      message.error(
        'Falló algo desde la base de datos, intentelo de nuevo más tarde',
      )
  }

}  
const onFinishFailed = async(errorInfo) => {
    console.log("Failed:", errorInfo);
};
</script>

<style>
</style>