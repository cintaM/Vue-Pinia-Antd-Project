import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { defineStore} from 'pinia'
import { computed, ref } from 'vue'
import { auth } from '../firebaseConfig'
import { useRouter } from 'vue-router'
import { async } from '@firebase/util'
import {onAuthStateChanged} from 'firebase/auth'
import { useDataBaseStore } from './database'

export const useUserStore = defineStore('user', () => {
  const userData = ref(null)
  const router = useRouter()
  const loadingUser = ref(false)
  const loadingSession =ref(false)

  const registerUser = async (email, password) => {
    loadingUser.value = true
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      userData.value = { email: user.email, uid: user.uid }
      router.push('/login')
    } catch (error) {
      console.log(error)
    }finally{
        loadingUser.value = false
    }
  }

  const loginUser = async (email, password) => {
    loadingUser.value = true
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      userData.value = { email: user.email, uid: user.uid }
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally{
        loadingUser.value = false
    }
  }

  const logOutUser = async () => {
    const userDataBase = useDataBaseStore()
    try {
      await signOut(auth)
      userData.value = null
      router.push('/login')
    } catch (error) {
      console.log(error)
    }finally{
    }
  }

  const currentUser = async() => {
    return new Promise((resolve, reject)=>{
       const unsuscribe = onAuthStateChanged(auth, (user)=>{
        const userDataBase = useDataBaseStore()
            if(user){
                userData.value = {email: user.email, uid: user.uid}
            }else{
                userData.value = null
                const userDataBase = useDataBaseStore()
            }
            resolve(user)
        }, e => reject(e))
        unsuscribe()
    })
  }

  return {
    userData,
    registerUser,
    loginUser,
    logOutUser,
    loadingUser,
    currentUser,
    loadingSession
  }
})
