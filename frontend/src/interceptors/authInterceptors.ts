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
        const urlPathname = new URL(rawUrl).pathname;

        const publicBackendEndpoints = [
            '/',
            '/job/jobs',
            '/job/search',
            '/job/applications/status',
        ];

        const isPublicBackendRequest = publicBackendEndpoints.some(prefix =>
            urlPathname === prefix || urlPathname.startsWith(prefix + '/')
        );

        if (isAuthError && isRetryable && isNotRefreshEndpoint && !isPublicBackendRequest) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post('/users/refresh-token/', {}, { withCredentials: true });
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                const publicFrontendPaths = ['/', '/register'];
                const isOnPublicFrontend = publicFrontendPaths.some(path =>
                    window.location.pathname === path || window.location.pathname.startsWith(path + '/')
                );

                if (!isOnPublicFrontend && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
