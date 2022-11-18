<template>
    <div>
        <h1> Login </h1>
        <form @submit.prevent="handleSubmit" action="" method="post">
            <input type="email" v-model.trim="email" id="email" placeholder="Enter your email" >
            <input type="password" v-model.trim="password"  id="password" placeholder="Enter a password">
            <button @click="submit" :disabled="userStore.loadingUser"> Login</button>
        </form>
    </div>
</template>
<script setup>
import {ref} from 'vue'
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router'
const router = useRouter()
const email = ref('')
const password = ref('')

const userStore = useUserStore()

const handleSubmit = async() => {
    if(!email.value){
        return alert('introduzca un correo válido')
    }
    if(!password.value || password.value.length < 5 ){
        return alert('introduzca una contraseña válida')
    }
     await userStore.loginUser(email.value, password.value)
     router.push('/')
     
}
</script>

<style>
</style>