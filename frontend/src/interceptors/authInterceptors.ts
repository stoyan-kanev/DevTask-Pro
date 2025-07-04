import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        const isAuthError = error.response?.status === 401;
        const isRetryable = !originalRequest._retry;
        const isNotRefreshEndpoint = !originalRequest.url.includes('/users/refresh-token/');

        const rawUrl = originalRequest.url.startsWith('http')
            ? originalRequest.url
            : `${originalRequest.baseURL || axiosInstance.defaults.baseURL}${originalRequest.url}`;
        const url = new URL(rawUrl).pathname;


        // Paths are from other app component interceptor they will be changed according to the propper paths for this project
        const publicEndpointPrefixes = [
            '/job/jobs',
            '/job/search',
            '/job/applications/status',
        ];

        const isPublicEndpoint = publicEndpointPrefixes.some(prefix =>
            url.startsWith(prefix)
        );

        const publicFrontendPaths = [
            '/',
        ];
        const isOnPublicFrontend = publicFrontendPaths.some(path =>
            window.location.pathname.startsWith(path)
        );

        if (isAuthError && isRetryable && isNotRefreshEndpoint && !isPublicEndpoint && !isOnPublicFrontend
        ) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post('/users/refresh-token/', {}, { withCredentials: true });
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                if (isOnPublicFrontend && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;