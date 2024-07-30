'use client';

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Layout from '../components/Layout';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        <Layout>{children}</Layout>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}