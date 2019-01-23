import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import prodConfig from './prodConfig';
import devConfig from './devConfig';

const prodMode = false;

let config = null;

if (prodMode) {
  config = prodConfig;
} else {
  config = devConfig;
}

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
