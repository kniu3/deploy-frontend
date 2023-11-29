import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBtgoXLhDfKFlAEqrQb41Il4m-SK9Q9ilE",
    authDomain: "ece9065lab4-c18b5.firebaseapp.com",
    projectId: "ece9065lab4-c18b5",
    storageBucket: "ece9065lab4-c18b5.appspot.com",
    messagingSenderId: "177535271296",
    appId: "1:177535271296:web:1f785b4c4d4e0cfbe3c165",
    measurementId: "G-RY7473PMKR"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export default app;