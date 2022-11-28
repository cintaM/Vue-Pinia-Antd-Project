import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import EditView from '../views/EditView.vue'
import { useUserStore } from '../store/user';
import ProfileView from '../views/ProfileView.vue'
import NotFound from '../views/NotFound.vue'
import { useDataBaseStore } from '../store/database';


const requireAuth = async(to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true
   const user = await userStore.currentUser();
   if (user){
    next();
   }else{
    next('/login');
   }
   userStore.loadingSession = false

}

const redirect = async(to, from, next) => {
    const dataBase = useDataBaseStore();
    const userStore = useUserStore();
    userStore.loadingSession = true
    const name = await dataBase.accessURL(to.params.pathMatch[0])
    if(!name){
         next()
         userStore.loadingSession = false
    }
    else {
        window.location.href = name;
        userStore.loadingSession = true;
        next()
    }
   
}

const routes = [
{ path:'/', component: HomeView, beforeEnter: requireAuth, name: 'home'
},
{ path:'/editar/:id', component: EditView, beforeEnter: requireAuth, name: 'edit'
},
{ path:'/login', component: LoginView, name: 'login'
},
{ path:'/register', component: RegisterView, name: 'register'
},
{ path:'/profile', component: ProfileView, beforeEnter: requireAuth, name: 'profile'
},
{ path:':/:pathMatch(.*)', component: NotFound,  name: 'notfound', beforeEnter: redirect
}

]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router;