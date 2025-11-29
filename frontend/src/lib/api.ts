import axios from 'axios';
import { auth } from './auth';

const API_BASE_URL ='backend-issue-production.up.railway.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",

  },
});

api.defaults.timeout = 90000
api.interceptors.response.use(
  (response) => {
    console.log("🚀 ~ response:", response)
    if (response.data?.code === -1 && response.data?.message === "Unauthorized") {
      localStorage.removeItem("token")
      window.location.href = '/login'
      // toast.error("Please login again")
      return response.data
    } else {
      return response.data
    }
  },
  (error) => {
    if (error.response.status === 401) {
      console.log(error)
      //   sessionStorage.removeItem("login")
      //   sessionStorage.removeItem("admin")
      localStorage.removeItem("token")
      window.location.href = '/login'
      // toast.error("Please login again")
    }
    console.error('Request Error', error)
  }
)