import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { defineStore } from 'pinia'
import { ref} from 'vue'
import { auth, db, storage } from '../firebaseConfig'
import { useRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { useDataBaseStore } from './database'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { getDownloadURL, ref as storageRef1 , uploadBytes } from 'firebase/storage'

export const useUserStore = defineStore('user', () => {
  const userData = ref(null)
  const router = useRouter()
  const loadingUser = ref(false)
  const loadingSession = ref(false)

  const registerUser = async (email, password) => {
    loadingUser.value = true
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      //userData.value = { email: user.email, uid: user.uid }
      await sendEmailVerification(auth.currentUser)
      router.push('/login')
    } catch (error) {
      console.log(error.code)
      return error.code
    } finally {
      loadingUser.value = false
    }
  }

  const loginUser = async (email, password) => {
    loadingUser.value = true
    try {
     const {user} =  await signInWithEmailAndPassword(auth, email, password)
      await setUser(user)
      router.push('/')
    } catch (error) {
      console.log(error.code)
      return error.code
    } finally {
      loadingUser.value = false
    }
  }

  const logOutUser = async () => {
    const userDataBase = useDataBaseStore()
    try {
      await signOut(auth)
      //userData.value = null
      router.push('/login')
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const currentUser = async () => {
    return new Promise((resolve, reject) => {
      const unsuscribe = onAuthStateChanged(
        auth,
        async (user) => {
          const userDataBase = useDataBaseStore()
          if (user) {
            console.log(user)
           userData.value = {
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
          } else {
            userData.value = null
            const userDataBase = useDataBaseStore()
            userDataBase.$reset();
          }
          resolve(user)
        },
        (e) => reject(e),
      )
      unsuscribe()
    })
  }

  const setUser = async(user) => {
    try {
      const docRef = doc(db, 'users', user.uid)
      const docSpan = await getDoc(docRef)

      userData.value = {
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }


  await setDoc(docRef, userData.value)
        
    } catch (error) {
      console.log(error)
    }
  }

  const updateUser = async(displayName) => {
    try {
       await updateProfile(auth.currentUser, {
      displayName: displayName
    })
    setUser(auth.currentUser)
    } catch (error) {
      console.log(error)
      return error.code
    }
   
  }

  const updateImagen = async(imagen) => {
    try {

      console.log(imagen)
      const storageRef = storageRef1( storage, `profiles/${userData.value.uid}`)
      await uploadBytes(storageRef, imagen.originFileObj)
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, {
        photoURL
      })
    } catch (error) {
      console.log(error)
      return error.code
    }
  }

  return {
    userData,
    registerUser,
    loginUser,
    logOutUser,
    loadingUser,
    currentUser,
    loadingSession,
    setUser,
    updateUser,
    updateImagen
  }
})
