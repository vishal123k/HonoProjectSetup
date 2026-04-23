import axios from 'axios';

// 127.0.0.1 use karna best practice hai local dev ke liye
const API = axios.create({
  baseURL: ' https://backend.vishalk38916.workers.dev/api',
});

// Har request ke sath Token bhejna
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;