<template>
    <h1> Editar la siguiente URL: {{route.params.id}}</h1>
  <a-form
    name="basicEdit"
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
      <a-input v-model:value="formState.url" />
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        large
        html-type="submit"
        :loading="useDatabase.loadingURL"
        :disabled="useDatabase.loadingURL"
      >
        Editar
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDataBaseStore } from '../store/database'
import { reactive } from 'vue'
import { message } from 'ant-design-vue';

const route = useRoute()
const useDatabase = useDataBaseStore()
const formState = reactive({
  url: '',
})


onMounted(async () => {
  formState.url = await useDatabase.leerUrl(route.params.id)
})

const onFinish = async (value) => {
    const response = await useDatabase.updateUrl(route.params.id, formState.url)
    if(!response){
         formState.url = ""
         message.success('URL editada')
    }
    if(response){
        message.error('Ha ocurrido algún error, por favor, inténtelo de nuevo más tarde')
    } 
}
</script>

<style></style>
