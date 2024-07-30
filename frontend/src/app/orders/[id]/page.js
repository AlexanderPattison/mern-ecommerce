'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import { getOrderById } from '../../../utils/api';

export default function OrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch order details');
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <Layout><div className="text-gray-800">Loading...</div></Layout>;
    if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;
    if (!order) return <Layout><div className="text-gray-800">Order not found</div></Layout>;

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Order Details</h1>
            <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Order #{order._id}</h2>
                <p className="text-gray-600"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-gray-600"><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
                <p className="text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod}</p>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Shipping Address</h3>
                <p className="text-gray-600">{order.shippingAddress.address}</p>
                <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Order Items</h3>
                <ul>
                    {order.orderItems.map((item) => (
                        <li key={item._id} className="mb-2 text-gray-600">
                            {item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)} each
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
}