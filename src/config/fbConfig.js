import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCeIo6NUgg7wgNoHB01a7ZaV-OH3M5umv8',
  authDomain: 'stritwise-app.firebaseapp.com',
  databaseURL: 'https://stritwise-app.firebaseio.com',
  projectId: 'stritwise-app',
  storageBucket: 'stritwise-app.appspot.com',
  messagingSenderId: '163282995304',
};

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
