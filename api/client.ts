import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';


const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000' 
    : 'http://127.0.0.1:3000';

export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


