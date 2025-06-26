import axios from 'axios';

export const AxiosBase = axios.create({ baseURL: '/api' });
