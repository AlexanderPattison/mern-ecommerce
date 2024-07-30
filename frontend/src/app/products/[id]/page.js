'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
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

    if (loading) return <Layout><div className="text-gray-800">Loading...</div></Layout>;
    if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;
    if (!product) return <Layout><div className="text-gray-800">Product not found</div></Layout>;

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
                <div className="md:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full h-auto" />
                </div>
                <div className="md:w-1/2 p-6">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-semibold mb-4 text-gray-800">${product.price.toFixed(2)}</p>
                    <button
                        onClick={handleAddToCart}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Layout>
    );
}