import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyB5RTm1lYo9Hf9xFGz1nSCxggKeK5-BxJ4",
    authDomain: "aula-a4f70.firebaseapp.com",
    projectId: "aula-a4f70",
    storageBucket: "aula-a4f70.appspot.com",
    messagingSenderId: "890823480397",
    appId: "1:890823480397:web:4ff06d14714b12f2ea3804",
    measurementId: "G-QL9LLXW2W8"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  export {db, auth};
