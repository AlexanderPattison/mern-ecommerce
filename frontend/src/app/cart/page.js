'use client';

import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Your Cart</h1>
            {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty. <Link href="/products" className="text-blue-500 hover:underline">Continue shopping</Link></p>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6">
                    {cart.map((item) => (
                        <div key={item._id} className="flex items-center justify-between border-b py-2">
                            <div className="flex items-center">
                                <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover mr-4" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-l"
                                >
                                    -
                                </button>
                                <span className="bg-gray-100 text-gray-800 px-3 py-1">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-r"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="ml-4 text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold text-gray-800">Total: ${total.toFixed(2)}</h2>
                        <div className="mt-4">
                            <Link href="/checkout" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4">
                                Proceed to Checkout
                            </Link>
                            <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}