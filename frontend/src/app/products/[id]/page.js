'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProduct } from '../../../utils/api';
import { useCart } from '../../../context/CartContext';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details. Please try again later.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center text-gray-800">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!product) return <div className="text-center text-gray-800">Product not found</div>;

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <div className="relative aspect-square w-full">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                </div>
                <div className="md:w-1/2 md:pl-8">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
                    <p className="text-xl font-semibold mb-4 text-gray-800">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                    <p className="text-sm text-gray-500 mb-6">In Stock: {product.countInStock}</p>
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        disabled={product.countInStock === 0}
                    >
                        {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
}