import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { HomeIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        closed: 0,
        critical: 0
    });

    useEffect(() => {
        fetch('https://safety-backend-69dl.onrender.com/api/anomalies/')
            .then(res => res.json())
            .then(data => {
                const total = data.length;
                const pending = data.filter(a => a.status === 'new' || a.status === 'approved').length;
                const resolved = data.filter(a => a.status === 'resolved').length;
                const closed = data.filter(a => a.status === 'closed').length;
                const critical = data.filter(a => a.risk_level === 'critical').length;
                setStats({ total, pending, resolved, closed, critical });
            })
            .catch(err => console.error('Error:', err));
    }, []);

    // داده‌های نمودار
    const barData = {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
        datasets: [
            {
                label: 'حوادث ثبت شده',
                data: [4, 7, 5, 9, 6, 8],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            }
        ]
    };

    const doughnutData = {
        labels: ['جدید', 'در حال بررسی', 'رفع شده', 'بسته شده'],
        datasets: [
            {
                data: [stats.pending, 3, stats.resolved, stats.closed],
                backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#6b7280'],
                borderWidth: 2,
            }
        ]
    };

    const lineData = {
        labels: ['هفته ۱', 'هفته ۲', 'هفته ۳', 'هفته ۴'],
        datasets: [
            {
                label: 'روند حوادث',
                data: [3, 5, 2, 4],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.3,
                fill: true,
            }
        ]
    };

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border-r-4 border-[#1a56db] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* هدر */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">📊 داشبورد مدیریت HSE</h1>
                <p className="text-gray-500 text-sm">خلاصه وضعیت ایمنی و حوادث</p>
            </div>

            {/* کارت‌های آماری */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="کل حوادث" 
                    value={stats.total} 
                    icon={HomeIcon} 
                    color="blue"
                    subtitle="از ابتدای سال"
                />
                <StatCard 
                    title="در انتظار بررسی" 
                    value={stats.pending} 
                    icon={ClockIcon} 
                    color="yellow"
                    subtitle="نیاز به اقدام فوری"
                />
                <StatCard 
                    title="بحرانی" 
                    value={stats.critical} 
                    icon={ExclamationTriangleIcon} 
                    color="red"
                    subtitle="بالاترین اولویت"
                />
                <StatCard 
                    title="بسته شده" 
                    value={stats.closed} 
                    icon={CheckCircleIcon} 
                    color="green"
                    subtitle="اقدامات انجام شده"
                />
            </div>

            {/* نمودارها */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* نمودار میله‌ای */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">📈 روند حوادث ماهانه</h3>
                    <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>

                {/* نمودار دایره‌ای */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">🔄 وضعیت حوادث</h3>
                    <div className="flex justify-center">
                        <div className="w-48 h-48">
                            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>

                {/* نمودار خطی */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">📉 روند هفتگی</h3>
                    <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
            </div>

            {/* لیست آخرین حوادث */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">🔔 آخرین حوادث ثبت شده</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <p className="font-medium text-gray-800">نشتی گاز در واحد الف</p>
                            <p className="text-sm text-gray-500">ثبت شده توسط: احمدی - ۱۴۰۴/۰۵/۲۰</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">بحرانی</span>
                    </div>
                    <div className="flex items-center justify-between border-b pb-3">
                        <div>
                            <p className="font-medium text-gray-800">سقوط کارگر از ارتفاع</p>
                            <p className="text-sm text-gray-500">ثبت شده توسط: کریمی - ۱۴۰۴/۰۵/۱۹</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded-full">در انتظار</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-800">خرابی کپسول آتش‌نشانی</p>
                            <p className="text-sm text-gray-500">ثبت شده توسط: محمدی - ۱۴۰۴/۰۵/۱۸</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">بسته شده</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;