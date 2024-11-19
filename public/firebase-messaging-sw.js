/* eslint-disable */
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js",
);

const credentials = {
  apiKey: "AIzaSyDwMHHMP8CL2oRFIYL0AKnZrcOwS59Ulz0",
  authDomain: "msstm-33df0.firebaseapp.com",
  projectId: "msstm-33df0",
  storageBucket: "msstm-33df0.appspot.com",
  messagingSenderId: "866892591692",
  appId: "1:866892591692:web:3a4a1ff893143123893ae9",
  measurementId: "G-LSC4H9CSL6"
};

firebase.initializeApp(credentials);
firebase.messaging().onBackgroundMessage((payload) => {
  const { notification } = payload;
  self.registration.showNotification(notification.title, {body: notification.body});
});
