'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

export default function AdminRootLayout({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user || !user.isAdmin) {
        return null;
    }

    return <AdminLayout>{children}</AdminLayout>;
}