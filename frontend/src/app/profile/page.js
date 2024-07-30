'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../utils/api';

export default function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const userOrders = await getUserOrders();
                    setOrders(userOrders);
                } catch (error) {
                    setError('Failed to fetch orders. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <Layout>
                <p className="text-gray-800">Please log in to view your profile.</p>
            </Layout>
        );
    }

    if (loading) return <Layout><div className="text-gray-800">Loading...</div></Layout>;
    if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;

    return (
        <Layout>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">User Profile</h1>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Account Information</h2>
                    <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Order History</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-700">You haven't placed any orders yet.</p>
                    ) : (
                        <ul>
                            {orders.map(order => (
                                <li key={order._id} className="mb-4 p-4 border rounded bg-gray-50">
                                    <p className="text-gray-700"><strong>Order ID:</strong> {order._id}</p>
                                    <p className="text-gray-700"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-gray-700"><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
                                    <p className="text-gray-700"><strong>Status:</strong> {order.isDelivered ? 'Delivered' : 'Processing'}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
}