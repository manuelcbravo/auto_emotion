import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://brief-centrally-unicorn.ngrok-free.app/auto_motion_laravel/public/api',
  // baseURL: 'https://automotion.fielgroup.com.mx/api',
  headers: { 
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  let token = null;

  if (Platform.OS === 'web') {
    try {
      const session = localStorage.getItem('session_automotion');
      if (session) {
        const parsedSession = JSON.parse(session);
        token = parsedSession ? parsedSession.token : null;
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    try {
      const session = await AsyncStorage.getItem('session_automotion');
      if (session) {
        const parsedSession = JSON.parse(session);
        token = parsedSession ? parsedSession.token : null;
      }
    } catch (error) {
      console.error('Error while setting authorization token:', error);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const getEvaluacionPendiente = () => {
  return axiosInstance.get('/evaluaciones_pendiente');
};

export const getEvaluacionProceso = () => {
  return axiosInstance.get('/evaluaciones_proceso');
};

export const getEvaluacionTerminadas = () => {
  return axiosInstance.get('/evaluaciones_terminadas');
};

export const getEvaluacionTotal = () => {
  return axiosInstance.get('/evaluaciones_total');
};

export const getVersion = (id_modelo, id_marca, id_anio) => {
  return axiosInstance.get(`/versiones/${id_modelo}/${id_marca}/${id_anio}`);
};

export const getEvaluacion = (id) => {
  return axiosInstance.get('/evaluacion/'+id);
};

export const setEvaluacionGuardar = (id, values) => {
  return axiosInstance.post('/evaluacioGuardar/'+id, values);
};

export const setEvaluacionGuardarFoto = (id, formData) => {
  return axiosInstance.post('/evaluacioGuardarFoto/' + id, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const setEvaluacionArchivo = (id, formData) => {
  return axiosInstance.post('/evaluacioArchivo/' + id, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default axiosInstance;
