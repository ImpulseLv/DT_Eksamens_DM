import axios, {AxiosRequestConfig} from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;
console.log("api url", process.env.REACT_APP_API_URL)
axios.interceptors.request.use(
    (config) => {
        const contentType = config.headers['Content-Type'];

        // Проверяем, установлен ли заголовок Content-Type и является ли он строкой
        if (!contentType) {
            config.headers['Content-Type'] = 'application/json';
        } else if (typeof contentType === 'string' && contentType.includes('multipart/form-data')) {
            // Устанавливаем заголовок Content-Type в multipart/form-data, если он был явно указан
            config.headers['Content-Type'] = 'multipart/form-data';
        } else if (config.data instanceof FormData) {
            // Если данные являются экземпляром FormData, устанавливаем Content-Type в multipart/form-data
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;

    })

export default axios;