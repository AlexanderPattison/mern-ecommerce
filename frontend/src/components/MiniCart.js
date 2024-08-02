'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function MiniCart() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-white hover:text-gray-200 transition-colors"
            >
                Cart ({cart.length})
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Your Cart</h3>
                        {cart.length === 0 ? (
                            <p className="text-gray-600">Your cart is empty</p>
                        ) : (
                            <>
                                {cart.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 text-sm hover:text-red-700 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <div className="mt-4">
                                    <p className="font-semibold text-gray-800">Total: ${total.toFixed(2)}</p>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <Link href="/cart" className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors">
                                        View Cart
                                    </Link>
                                    <Link href="/checkout" className="block w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition-colors">
                                        Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}