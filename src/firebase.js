import { initializeApp } from 'firebase/app'
import {
  getAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth'
const firebaseConfig = {
  apiKey: 'AIzaSyCNPA21TL-EUhkbRM3UXHg7izXRpp46IlM',
  authDomain: 'connect-ef1c5.firebaseapp.com',
  projectId: 'connect-ef1c5',
  storageBucket: 'connect-ef1c5.appspot.com',
  messagingSenderId: '564194901088',
  appId: '1:564194901088:web:8e0df71baa23f0f4769705',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const FBprovider = new FacebookAuthProvider()
const Googleprovider = new GoogleAuthProvider()
const Appleprovider = new OAuthProvider('apple.com')

export { auth, FBprovider, Googleprovider, Appleprovider }
