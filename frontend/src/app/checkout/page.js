'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../utils/api';

export default function Checkout() {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to complete your order');
            router.push('/login');
            return;
        }

        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            alert('Please fill in all shipping address fields');
            return;
        }

        try {
            const orderData = {
                orderItems: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item._id,
                })),
                shippingAddress,
                paymentMethod,
                totalPrice: total,
            };

            const order = await createOrder(orderData);
            clearCart();
            router.push(`/orders/${order._id}`);
        } catch (error) {
            alert(`Error creating order: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Checkout</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Shipping Address</h2>
                <div className="mb-4">
                    <label htmlFor="address" className="block mb-1 text-gray-700">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded text-gray-800"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="city" className="block mb-1 text-gray-700">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded text-gray-800"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="postalCode" className="block mb-1 text-gray-700">Postal Code</label>
                    <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded text-gray-800"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block mb-1 text-gray-700">Country</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded text-gray-800"
                    />
                </div>

                <h2 className="text-xl font-semibold mb-2 mt-4 text-gray-800">Payment Method</h2>
                <div className="mb-4">
                    <select
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded text-gray-800"
                    >
                        <option value="PayPal">PayPal</option>
                        <option value="CreditCard">Credit Card</option>
                    </select>
                </div>

                <h2 className="text-xl font-semibold mb-2 text-gray-800">Order Summary</h2>
                <ul className="mb-4">
                    {cart.map(item => (
                        <li key={item._id} className="flex justify-between text-gray-700">
                            <span>{item.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-xl font-semibold mb-4 text-gray-800">
                    Total: ${total.toFixed(2)}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
                    Place Order
                </button>
            </form>
        </Layout>
    );
}