'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import MiniCart from './MiniCart';

export default function Layout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <Link href="/" className="text-xl font-bold mb-2 md:mb-0">
                        E-Commerce Store
                    </Link>
                    <div className="w-full md:w-auto mb-2 md:mb-0">
                        <SearchBar />
                    </div>
                    <nav>
                        <ul className="flex space-x-4 items-center">
                            <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
                            <li><Link href="/products" className="hover:text-gray-300">Products</Link></li>
                            <li><MiniCart /></li>
                            {user ? (
                                <>
                                    <li><Link href="/profile" className="hover:text-gray-300">Profile</Link></li>
                                    <li><button onClick={logout} className="hover:text-gray-300">Logout</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link href="/login" className="hover:text-gray-300">Login</Link></li>
                                    <li><Link href="/register" className="hover:text-gray-300">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="bg-blue-600 text-white p-4">
                <div className="container mx-auto text-center">
                    © 2024 E-Commerce Store. All rights reserved.
                </div>
            </footer>
        </div>
    );
}