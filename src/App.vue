<template>
<div>
  <nav v-if="!userStore.loadingSession">
    <RouterLink to="/" v-if="userStore.userData">Home</RouterLink>||
    <RouterLink v-if="!userStore.userData" to="/login">Login</RouterLink>||
    <RouterLink v-if="!userStore.userData" to="/register">Register</RouterLink>||
    <button v-if="userStore.userData" @click="userStore.logOutUser">Logout</button>
  </nav>
  <div v-else>
    Cargando información...
  </div>
  
  <h1>
  APP base
</h1>


</div>
<RouterView/>
</template>
<script setup>
import { useUserStore } from './store/user';

const userStore = useUserStore();


</script>
<style scoped>
</style>
