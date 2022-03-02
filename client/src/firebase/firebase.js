
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyASYwdNauCyZHnazijL38-NkoU2ATFueFU",
    authDomain: "social-app-c804c.firebaseapp.com",
    projectId: "social-app-c804c",
    storageBucket: "social-app-c804c.appspot.com",
    messagingSenderId: "232272964448",
    appId: "1:232272964448:web:6bafa8d191bfaa7fb78c05",
    measurementId: "G-EQV2FFD97M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };