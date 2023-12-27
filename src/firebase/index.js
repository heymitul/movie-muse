import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import config from '../config/config';

import { getStorage } from 'firebase/storage';

firebase.default.initializeApp(config.firebaseConfig);

export const auth = firebase.auth();
export const storage = getStorage();
