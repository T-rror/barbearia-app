// lib/firebase.js
// lib/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'



const firebaseConfig = {
  apiKey: "AIzaSyDEqP6RkodnonVeSBKuogE3sgG-Q1dxiWg",
  authDomain: "barbearia-da-neguinha.firebaseapp.com",
  projectId: "barbearia-da-neguinha",
  storageBucket: "barbearia-da-neguinha.appspot.com",
  messagingSenderId: "937309113451",
  appId: "1:937309113451:web:7d33342ba032261f10752e",
  measurementId: "G-Z4Q843ZXM4"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
