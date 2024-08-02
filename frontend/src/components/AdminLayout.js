import Link from 'next/link';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <nav className="w-64 bg-gray-800 p-4">
                <h2 className="text-white text-xl font-bold mb-4">Admin Dashboard</h2>
                <ul className="space-y-2">
                    <li>
                        <Link href="/admin" className="text-gray-300 hover:text-white">
                            Overview
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/products" className="text-gray-300 hover:text-white">
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/orders" className="text-gray-300 hover:text-white">
                            Orders
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/users" className="text-gray-300 hover:text-white">
                            Users
                        </Link>
                    </li>
                </ul>
            </nav>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;