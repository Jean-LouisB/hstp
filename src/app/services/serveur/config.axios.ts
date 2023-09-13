import axios from 'axios';
import { CookieService } from 'ngx-cookie-service'; // Importe le CookieService
import { environment } from 'src/app/environnement';
const apiUrl = environment.apiUrl;


export function configureAxios(cookieService: CookieService) {
  const axiosInstance = axios.create({
    baseURL: apiUrl,
  });

  axiosInstance.interceptors.request.use((config) => {
    const authToken = cookieService.get('session'); 

    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  });

  return axiosInstance;
}