<template>
 <form @submit.prevent="handleSubmit(url)">
            <input type="text" placeholder="ingrese una url" v-model="url">
            <button type="submit"> Editar</button>
        </form>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDataBaseStore } from '../store/database'
import {ref} from 'vue'

const route = useRoute();
const useDatabase = useDataBaseStore();
const url = ref('')

const handleSubmit = () => {
    useDatabase.updateUrl(route.params.id, url.value)

}

onMounted(async()=>{
   url.value = await useDatabase.updateUrl(route.params.id)
   
})
</script>

<style>
</style>