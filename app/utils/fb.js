// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider, signInWithPopup,
    initializeAuth,
} from 'firebase/auth';
import {
    getDatabase,
    onValue,
    push,
    ref,
    set,
} from 'firebase/database';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import {
    getDownloadURL,
    getStorage,
    uploadBytesResumable,
} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBzXYHu-Q0eptvvn_RW4BEa5wWcq5S9gq8",
    authDomain: "testproject-2d7fb.firebaseapp.com",
    databaseURL: "https://testproject-2d7fb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "testproject-2d7fb",
    storageBucket: "testproject-2d7fb.firebasestorage.app",
    messagingSenderId: "892222964216",
    appId: "1:892222964216:web:5aa1f5a8dafb1ae0a2560d",
    measurementId: "G-0JGLYDK8Y7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const Revisi = ref(app);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider(app);

export {
    provider,
    addDoc,
    auth,
    collection,
    db,
    database,
    deleteDoc,
    doc,
    getAuth,
    getDocs,
    getDownloadURL,
    getStorage,
    onSnapshot,
    onValue,
    push,
    query,
    ref,
    set,
    updateDoc,
    uploadBytesResumable,
    where,
}