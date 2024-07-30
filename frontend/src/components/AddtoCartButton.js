'use client';

import { useCart } from '../context/CartContext';

export default function AddToCartButton({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Add to Cart
        </button>
    );
}