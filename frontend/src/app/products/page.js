'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getProducts } from '../../utils/api';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <Layout><div className="text-gray-800">Loading...</div></Layout>;
    if (error) return <Layout><div className="text-red-600">{error}</div></Layout>;

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 bg-white shadow-md">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
                        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                        <Link href={`/products/${product._id}`} className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </Layout>
    );
}