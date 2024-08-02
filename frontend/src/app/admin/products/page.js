'use client';

import { useState, useEffect } from 'react';
import { getAdminProducts, updateProduct, deleteProduct, bulkDeleteProducts } from '../../../utils/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterCategory, setFilterCategory] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAdminProducts();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleFilter = (category) => {
        setFilterCategory(category);
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            try {
                await bulkDeleteProducts(selectedProducts);
                fetchProducts();
                setSelectedProducts([]);
            } catch (err) {
                setError('Failed to delete products');
            }
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                fetchProducts();
            } catch (err) {
                setError('Failed to delete product');
            }
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        try {
            await updateProduct(id, productData);
            fetchProducts();
            setEditingProduct(null);
        } catch (err) {
            setError('Failed to update product');
        }
    };

    const sortedAndFilteredProducts = products
        .filter(product => filterCategory ? product.category === filterCategory : true)
        .sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    const uniqueCategories = [...new Set(products.map(product => product.category))];

    if (loading) return <div className="text-center py-10 text-gray-800">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Products</h1>

            {/* Filter and Bulk Actions */}
            <div className="mb-4 flex justify-between items-center">
                <select
                    onChange={(e) => handleFilter(e.target.value)}
                    className="p-2 border rounded text-gray-800"
                >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <button
                    onClick={handleBulkDelete}
                    disabled={selectedProducts.length === 0}
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    Delete Selected ({selectedProducts.length})
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedProducts(products.map(p => p._id));
                                        } else {
                                            setSelectedProducts([]);
                                        }
                                    }}
                                />
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-gray-800 hover:text-gray-600" onClick={() => handleSort('name')}>Name</th>
                            <th className="px-4 py-2 cursor-pointer text-gray-800 hover:text-gray-600" onClick={() => handleSort('price')}>Price</th>
                            <th className="px-4 py-2 cursor-pointer text-gray-800 hover:text-gray-600" onClick={() => handleSort('category')}>Category</th>
                            <th className="px-4 py-2 cursor-pointer text-gray-800 hover:text-gray-600" onClick={() => handleSort('countInStock')}>In Stock</th>
                            <th className="px-4 py-2 text-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredProducts.map((product) => (
                            <tr key={product._id} className="border-b">
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts([...selectedProducts, product._id]);
                                            } else {
                                                setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-2 text-gray-800">{product.name}</td>
                                <td className="px-4 py-2 text-gray-800">${product.price.toFixed(2)}</td>
                                <td className="px-4 py-2 text-gray-800">{product.category}</td>
                                <td className="px-4 py-2 text-gray-800">{product.countInStock}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingProduct && (
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleUpdateProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            )}
        </div>
    );
}

function ProductForm({ product, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(product);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product._id, formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Product</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        placeholder="Product Name"
                        className="w-full p-2 mb-2 border rounded text-gray-800"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full p-2 mb-2 border rounded text-gray-800"
                    />
                    <input
                        type="text"
                        name="category"
                        value={formData.category || ''}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full p-2 mb-2 border rounded text-gray-800"
                    />
                    <input
                        type="number"
                        name="countInStock"
                        value={formData.countInStock || ''}
                        onChange={handleChange}
                        placeholder="Count in Stock"
                        className="w-full p-2 mb-2 border rounded text-gray-800"
                    />
                    <div className="flex justify-end">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}