
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDOJVDIE5Gz-2LW1TRRv1GNvLSkPAM5Ii8",
  authDomain: "udemy-vue-project-7c0da.firebaseapp.com",
  projectId: "udemy-vue-project-7c0da",
  storageBucket: "udemy-vue-project-7c0da.appspot.com",
  messagingSenderId: "343497217102",
  appId: "1:343497217102:web:0152917d02bd7ecf36df1f"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth()

const db = getFirestore()

const storage = getStorage(firebaseApp)

export {auth, db, storage}