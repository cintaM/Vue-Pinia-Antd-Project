<template>
  <h1>Home</h1>
  <p>{{ userStore.userData.email }}</p>

  <DocumentsNew></DocumentsNew>

  <p v-if="userDataBase.loading">Loading docs</p>
  <a-space
    direction="vertical"
    v-if="!userDataBase.loading"
    style="width: 100%;"
  >
    <a-card
      v-for="item in userDataBase.documents"
      :key="item.id"
      :title="item.short"
      style="width: 100%;"
    >
      <template #extra>
        <a-space>
          <a-popconfirm  title="¿Estás seguro?"
                            ok-text="Yes"
                            cancel-text="No"
                            @confirm="confirm(item.id)"
                            @cancel="cancel">
            <a-button danger>
              Eliminar
            </a-button>
          </a-popconfirm>
          <a-button @click="router.push(`/editar/${item.id}`)">
            Editar
          </a-button>
        </a-space>
      </template>
      <p>{{ item.name }}</p>
    </a-card>
  </a-space>
</template>
<script setup>
import { useUserStore } from '../store/user'
import { useDataBaseStore } from '../store/database'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const userStore = useUserStore()
const userDataBase = useDataBaseStore()
const router = useRouter()

userDataBase.getUrls()

const confirm = (id) => {
   const response = userDataBase.deleteUrl(id);
   if(!response){
    message.success("Eliminado");
   }
   if(response){
    message.error('Ha habido algún error al eliminar, inténtelo de nuevo más tarde')
   }
    
};

const cancel = (e) => {
    console.log(e);
    message.error("No se eliminó");
};
</script>

<style></style>
