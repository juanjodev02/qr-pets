import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB44TEYDCQBWEpfbnrubXmbUsnuA45tqGU",
  authDomain: "qr-pets-2aa37.firebaseapp.com",
  projectId: "qr-pets-2aa37",
  storageBucket: "qr-pets-2aa37.appspot.com",
  messagingSenderId: "32079236534",
  appId: "1:32079236534:web:1d5c9ff91bccf10aab4517"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}