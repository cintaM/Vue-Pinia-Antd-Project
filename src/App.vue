<template>
<a-layout>
  <a-layout-header v-if="!userStore.loadingSession">
      <a-menu
          mode="horizontal"
          theme="dark"
          :style="{ lineHeight: '64px' }"
          v-model:selectedKeys="selectedKeys"
      >
          <a-menu-item v-if="userStore.userData" key="home">
              <router-link to="/">Home</router-link>
          </a-menu-item>
          <a-menu-item v-if="userStore.userData" key="profile">
              <router-link to="/profile">Profile</router-link>
          </a-menu-item>
          <a-menu-item v-if="!userStore.userData" key="login">
              <router-link to="/login">Login</router-link>
          </a-menu-item>
          <a-menu-item v-if="!userStore.userData" key="register">
              <router-link to="/register">Register</router-link>
          </a-menu-item>
          <a-menu-item
              @click="userStore.logOutUser"
              v-if="userStore.userData"
              key="logout"
          >
              Logout
          </a-menu-item>
      </a-menu>
  </a-layout-header>
  <a-layout-content style="padding: 0 50px">
      <div class="container">
          <div v-if="userStore.loadingSession">loading user...</div>
          <router-view v-else></router-view>
      </div>
  </a-layout-content>
</a-layout>
</template>
<script setup>
import { useUserStore } from './store/user';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'

const userStore = useUserStore();
const route = useRoute();
const selectedKeys = ref([])

watch(() => route.name, () => {
  selectedKeys.value = [route.name]
})
</script>
<style >

.container{
    background-color: #fff;
    padding: 24px;
    min-height: calc(100vh - 64px);
}

</style>
