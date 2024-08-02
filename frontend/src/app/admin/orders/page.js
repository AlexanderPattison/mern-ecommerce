'use client';

import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderToDelivered } from '../../../utils/api';
import { FaCheck } from 'react-icons/fa';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await getAdminOrders();
            setOrders(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const handleMarkAsDelivered = async (orderId) => {
        try {
            await updateOrderToDelivered(orderId);
            fetchOrders();
        } catch (err) {
            setError('Failed to update order');
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-800">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Orders</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-700">Order ID</th>
                            <th className="px-4 py-2 text-left text-gray-700">User</th>
                            <th className="px-4 py-2 text-left text-gray-700">Date</th>
                            <th className="px-4 py-2 text-left text-gray-700">Total</th>
                            <th className="px-4 py-2 text-left text-gray-700">Paid</th>
                            <th className="px-4 py-2 text-left text-gray-700">Delivered</th>
                            <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="border px-4 py-2 text-gray-800">{order._id}</td>
                                <td className="border px-4 py-2 text-gray-800">{order.user?.name}</td>
                                <td className="border px-4 py-2 text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2 text-gray-800">${order.totalPrice.toFixed(2)}</td>
                                <td className="border px-4 py-2 text-gray-800">
                                    {order.isPaid ? (
                                        <span className="text-green-500">Paid</span>
                                    ) : (
                                        <span className="text-red-500">Not Paid</span>
                                    )}
                                </td>
                                <td className="border px-4 py-2 text-gray-800">
                                    {order.isDelivered ? (
                                        <span className="text-green-500">Delivered</span>
                                    ) : (
                                        <span className="text-red-500">Not Delivered</span>
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {!order.isDelivered && (
                                        <button
                                            onClick={() => handleMarkAsDelivered(order._id)}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            <FaCheck className="inline mr-1" /> Mark as Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}