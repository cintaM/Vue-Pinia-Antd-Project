<template>
  <a-form
    name="basicDoc"
    autocomplete="off"
    layout="vertical"
    :model="formState"
    @finish="onFinish"
  >
    <a-form-item
      name="url"
      label="introduzca una url"
      :rules="[
        {
          required: true,
          whitespace: true,
          pattern: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
          message: 'Por favor, introduce una url válida',
        },
      ]"
    >
    <a-input v-model:value="formState.url" /></a-form-item>
    <a-form-item>
      <a-button type="primary" large html-type="submit" :loading="userDataBase.loadingURL" :disabled="userDataBase.loadingURL"> Agregar URL</a-button>
    </a-form-item>
  </a-form>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { reactive } from 'vue'
import { useDataBaseStore } from '../store/database'
const userDataBase = useDataBaseStore();
const formState = reactive({
  url: '',
})

const onFinish = async (value) => {
    const response = await userDataBase.addUrl(formState.url)
    if(!response){
         formState.url = ""
         message.success('URL agregada')
    }
    if(response){
        message.error('Ha ocurrido algún error, por favor, inténtelo de nuevo más tarde')
    } 
}
</script>
<style scoped></style>
