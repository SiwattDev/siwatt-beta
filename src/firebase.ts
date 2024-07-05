import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDrEoCFevX0rSXqVdK5KbSIO_ArcEkXfFs',
    authDomain: 'siwatt-database.firebaseapp.com',
    projectId: 'siwatt-database',
    storageBucket: 'siwatt-database.appspot.com',
    messagingSenderId: '261841563431',
    appId: '1:261841563431:web:06a4dff00ea63ae231c302',
    measurementId: 'G-F3P5Z85924',
}

initializeApp(firebaseConfig)

const auth = getAuth()

export { auth }
