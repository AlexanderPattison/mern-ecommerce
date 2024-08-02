import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    const token = getAuthToken();
    try {
        const response = await api.post('/orders', orderData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const getUserOrders = async () => {
    const token = getAuthToken();
    try {
        const response = await api.get('/orders/myorders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export const getOrderById = async (id) => {
    const token = getAuthToken();
    try {
        const response = await api.get(`/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const searchProducts = async (query) => {
    try {
        const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// Admin: Get all products
export const getAdminProducts = async () => {
    const token = getAuthToken();
    try {
        const response = await api.get('/admin/products', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin products:', error);
        throw error;
    }
};

// Admin: Update product
export const updateProduct = async (id, productData) => {
    const token = getAuthToken();
    try {
        const response = await api.put(`/admin/products/${id}`, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Admin: Delete product
export const deleteProduct = async (id) => {
    const token = getAuthToken();
    try {
        const response = await api.delete(`/admin/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Admin: Get all orders
export const getAdminOrders = async () => {
    const token = getAuthToken();
    try {
        const response = await api.get('/admin/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
    }
};

// Admin: Update order to delivered
export const updateOrderToDelivered = async (id) => {
    const token = getAuthToken();
    try {
        const response = await api.put(`/admin/orders/${id}/deliver`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating order to delivered:', error);
        throw error;
    }
};

// Admin: Get all users
export const getAdminUsers = async () => {
    const token = getAuthToken();
    try {
        const response = await api.get('/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin users:', error);
        throw error;
    }
};

// Admin: Delete user
export const deleteUser = async (id) => {
    const token = getAuthToken();
    try {
        const response = await api.delete(`/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const getDashboardStats = async () => {
    const token = getAuthToken();
    try {
        const response = await api.get('/admin/dashboard-stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

// Admin: Bulk delete products
export const bulkDeleteProducts = async (productIds) => {
    const token = getAuthToken();
    try {
        const response = await api.post('/admin/products/bulk-delete', { productIds }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error bulk deleting products:', error);
        throw error;
    }
};

// Get recent activity (for admin dashboard)
export const getRecentActivity = async () => {
    const token = getAuthToken();
    try {
        const response = await api.get('/admin/recent-activity', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
};