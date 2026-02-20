import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar o Bearer Token em todas as requisições
apiClient.interceptors.request.use(
    (config) => {
        const token = import.meta.env.VITE_TASY_API_TOKEN;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de resposta para tratamento global de erros
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Token expirado ou inválido. Verifique o VITE_TASY_API_TOKEN.');
        }
        return Promise.reject(error);
    }
);

export default apiClient;