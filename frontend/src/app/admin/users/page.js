'use client';

import { useState, useEffect } from 'react';
import { getAdminUsers, deleteUser } from '../../../utils/api';
import { FaTrash, FaUserShield } from 'react-icons/fa';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAdminUsers();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Users</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-700">ID</th>
                            <th className="px-4 py-2 text-left text-gray-700">Name</th>
                            <th className="px-4 py-2 text-left text-gray-700">Email</th>
                            <th className="px-4 py-2 text-left text-gray-700">Admin</th>
                            <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="border px-4 py-2 text-gray-800">{user._id}</td>
                                <td className="border px-4 py-2 text-gray-800">{user.name}</td>
                                <td className="border px-4 py-2 text-gray-800">{user.email}</td>
                                <td className="border px-4 py-2">
                                    {user.isAdmin ? (
                                        <span className="text-green-500 flex items-center">
                                            <FaUserShield className="mr-1" /> Yes
                                        </span>
                                    ) : (
                                        <span className="text-red-500">No</span>
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={user.isAdmin}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}