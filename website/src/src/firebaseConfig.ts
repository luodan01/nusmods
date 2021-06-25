import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBc0r99P9Mdeme1JlfotgpnuiVcOxghfmE",
  authDomain: "htwoo-module-planner.firebaseapp.com",
  projectId: "htwoo-module-planner",
  storageBucket: "htwoo-module-planner.appspot.com",
  messagingSenderId: "1097132220327",
  appId: "1:1097132220327:web:ad0ab52f792cc9a90fa082",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
