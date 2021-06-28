import firebase from "firebase";


const firebaseConfig = {
  apiKey: "AIzaSyCg3YGBYhcmAB5tkgaC6V3wQf-b8uy8bVc",
  authDomain: "nusmods-planner.firebaseapp.com",
  projectId: "nusmods-planner",
  storageBucket: "nusmods-planner.appspot.com",
  messagingSenderId: "463105634154",
  appId: "1:463105634154:web:7697aee6e59bf1f8537f13"
  };
  
firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
