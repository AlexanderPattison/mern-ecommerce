'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

    if (loading) return <div className="text-center text-gray-800">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <div key={product._id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
                        <Link href={`/products/${product._id}`}>
                            <div className="aspect-w-1 aspect-h-1 w-full">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full"
                                    priority={index === 0}
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h2>
                                <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}