// lib/auth.js
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { app } from "./firebase"

const auth = getAuth(app)

export { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
