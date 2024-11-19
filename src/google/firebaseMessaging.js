// Import the functions you need from the SDKs you need
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { Notification } from "element-ui";
import store from "@/store/store.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwMHHMP8CL2oRFIYL0AKnZrcOwS59Ulz0",
  authDomain: "msstm-33df0.firebaseapp.com",
  projectId: "msstm-33df0",
  storageBucket: "msstm-33df0.appspot.com",
  messagingSenderId: "866892591692",
  appId: "1:866892591692:web:3a4a1ff893143123893ae9",
  measurementId: "G-LSC4H9CSL6"
};

// Initialize Firebase
let
    app,
    messaging,
    isSupportedFirebase;

(async() => {
    isSupportedFirebase = await isSupported();
    if (isSupportedFirebase) {
        app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);

        onMessage(messaging, (payload) => {
            const { notification } = payload;
            Notification.info({
                title: notification.title,
                dangerouslyUseHTMLString: true,
                message: notification.body,
                duration: 5000
              });
            store.commit("PUSH_NOTIFICATION", payload.data)
        });
    } else console.warn("MSS notifications are turned off, No SSL for the current host");
})();

export default {
    firebaseConfig,
    app,
    isSupportedFirebase: async() => await isSupported(),
    fbToken: async() => await getToken(messaging, { vapidKey: "BB8Jv39ACQIYKWtGDlwrngbF9IgZJ9qRyFKPHzGn2dAyQx28ov-hywAhOl9su5hDziU5kVd0DZ7uoTRuQcwqsXM" }),
};
