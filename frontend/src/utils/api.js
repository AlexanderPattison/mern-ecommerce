import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const getProduct = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export const getUserOrders = async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

export const searchProducts = async (query) => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
};