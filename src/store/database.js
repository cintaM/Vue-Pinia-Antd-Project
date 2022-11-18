import { async } from "@firebase/util";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { defineStore} from "pinia";
import { ref } from 'vue'
import {db} from '../firebaseConfig'
import { auth } from '../firebaseConfig'
import { nanoid} from 'nanoid'
import router from "../router/router";

export const useDataBaseStore = defineStore ('database', () => {

    const documents = ref([])
    const loading = ref(false)


    const getUrls = async() =>{

        if(documents.value.length !== 0){
            return
        }
        loading.value= true
        documents.value = []
        const q = query(collection(db, 'urls'))
        try {   
            const querySnapShot = await getDocs(q)
            console.log(querySnapShot)
            querySnapShot.forEach((doc) => {
              documents.value.push({id: doc.id, ...doc.data()})
            })
        } catch (error) {
            console.log(error)
        }finally{
            loading.value = false
        }
    }

    const addUrl = async(name) => {
        try {
            const objectDoc = {
                name: name,
                short: nanoid(6),
                user: auth.currentUser.uid

            }
            const docRef =  await addDoc(collection(db, 'urls'), {
                objectDoc
            });
            documents.value.push({id: docRef.id, ...objectDoc})
        } catch (error) {
            
        }finally{
            loading.value=false
        }
    }

    const updateUrl = async(id, name) => {
        loading.value = true
        try {
            const docRef = doc(db, 'urls', id)
            const docSnap = await getDocs(docRef)
            if(docSnap.exists()){
                throw new Error("no existe el documento")
            }
            if(docSnap.data.user !== auth.currentUser.uid){
                throw new Error("No le pertenece este documento")
            }

           await updateDoc(docRef, {name: name, })
           documents.value = documents.value.map(item => item.id === id ? ({...item, name: name}) : item)
           router.push('/')
            
        } catch (error) {
            console.log(error)
        }finally{
            loading.value = false
        }
    }

    const deleteUrl = async(id) =>{
        loading.value = true
        try {
            const docRef = doc(db, 'urls', id)
            const docSnap = await getDocs(docRef)
            if(docSnap.exists()){
                throw new Error("no existe el documento")
            }
            if(docSnap.data.user !== auth.currentUser.uid){
                throw new Error("No le pertenece este documento")
            }
            await deleteDoc(docRef);
            documents.value = documents.value.filter(item => item.id !== id)
        } catch (error) {
            console.log(error)
        }finally{
            loading.value = false
        }
    }
    return{
        documents,
        getUrls,
        loading,
        addUrl,
        deleteUrl,
        updateUrl
    }
})