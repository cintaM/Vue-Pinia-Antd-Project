<template>
    <div>
        <h1> Home</h1>
        <p> {{userStore.userData.email}}</p>
        <form @submit.prevent="handleSubmit(url)">
            <input type="text" placeholder="ingrese una url" v-model= "url">
            <button type="submit"> Agregar</button>
        </form>
        <p v-if="userDataBase.loading"> Loading docs</p>
        <ul v-else >
            <li v-for="item in userDataBase.documents" :key="item.id">
                {{item.name}} 
                <br>
                {{item.short}}
                <br>
                <button @click="userDataBase.deleteUrl(item.id)">Eliminar</button>
                <button @click="router.push(`/editar/${item.id}`)">Editar</button>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { useUserStore } from '../store/user';
import { useDataBaseStore } from '../store/database'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const userDataBase = useDataBaseStore();
const router = useRouter();

userDataBase.getUrls();

const url = ref('')

const handleSubmit = () => {
    userDataBase.addUrl(url.value)
}

</script>

<style>
</style>