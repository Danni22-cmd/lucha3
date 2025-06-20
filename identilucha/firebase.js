// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqtUXbPvDtOcuZLwFsxll3TD7F3ICQzFo",
  authDomain: "identilucha.firebaseapp.com",
  projectId: "identilucha",
  storageBucket: "identilucha.appspot.com",
  messagingSenderId: "338101541555",
  appId: "1:338101541555:web:edb3e5143ba87580c8eec6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
