import axios from 'axios';

import 'firebase/auth';
import 'firebase/firestore';

import { auth } from '../firebase/index';
import Utils from './utils';
import config from '../config/config';

const mAxios = axios.create({
  baseURL: config.apiUrl
});

mAxios.CancelToken = axios.CancelToken;
mAxios.isCancel = axios.isCancel;

mAxios.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

mAxios.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (mAxios.isCancel(error)) {
    return {
      data: {
        type: 'canceled',
        error: error.message || 'Aborted'
      }
    };
  }

  let response = {};
  if (error.response) {
    response = error.response;
  } else if (error.request) {
    response = {
      data: {
        type: 'error',
        message: error.responseText || error.message
      }
    };
  } else {
    response = {
      data: {
        type: 'error',
        message: error.message
      }
    };
  }

  return await Utils.handleResponseError(response);
});

export default mAxios;
