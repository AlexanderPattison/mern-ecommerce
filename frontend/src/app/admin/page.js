'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats, getRecentActivity } from '../../utils/api';
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsData = await getDashboardStats();
            const activityData = await getRecentActivity();
            setStats(statsData);
            setSalesData(statsData.salesOverTime);
            setRecentActivity(activityData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-800">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    const chartData = {
        labels: salesData?.map(d => d.date) || [],
        datasets: [
            {
                label: 'Sales',
                data: salesData?.map(d => d.total) || [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<FaBox />} title="Total Products" value={stats.products || 'N/A'} color="bg-blue-500" textColor="text-white" />
                <StatCard icon={<FaShoppingCart />} title="Total Orders" value={stats.orders || 'N/A'} color="bg-green-500" textColor="text-white" />
                <StatCard icon={<FaUsers />} title="Total Users" value={stats.users || 'N/A'} color="bg-yellow-500" textColor="text-gray-800" />
                <StatCard
                    icon={<FaDollarSign />}
                    title="Total Revenue"
                    value={stats.revenue ? `$${stats.revenue.toFixed(2)}` : '$0.00'}
                    color="bg-purple-500"
                    textColor="text-white"
                />
            </div>

            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Sales Over Time</h2>
                <Line data={chartData} />
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
                <ul>
                    {recentActivity.map((activity, index) => (
                        <li key={index} className="mb-2 text-gray-700">
                            {activity.type}: {activity.description} - {new Date(activity.date).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color, textColor }) {
    return (
        <div className={`${color} rounded-lg shadow-lg p-6 ${textColor}`}>
            <div className="flex items-center justify-between">
                <div className="text-3xl">{icon}</div>
                <div className="text-4xl font-bold">{value}</div>
            </div>
            <div className="mt-4 text-lg font-semibold">{title}</div>
        </div>
    );
}