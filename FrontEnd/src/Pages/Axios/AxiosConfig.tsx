import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;