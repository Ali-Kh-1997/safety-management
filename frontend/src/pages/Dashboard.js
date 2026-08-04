import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
        critical: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/anomalies/')
            .then(res => res.json())
            .then(data => {
                const total = data.length;
                const pending = data.filter(a => a.status === 'new' || a.status === 'approved').length;
                const inProgress = data.filter(a => a.status === 'assigned' || a.status === 'in_progress').length;
                const resolved = data.filter(a => a.status === 'resolved').length;
                const closed = data.filter(a => a.status === 'closed').length;
                const critical = data.filter(a => a.risk_level === 'critical').length;

                setStats({
                    total,
                    pending,
                    inProgress,
                    resolved,
                    closed,
                    critical
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>📊 داشبورد مدیریت ایمنی</h1>
            
            {loading ? (
                <p>⏳ در حال بارگذاری...</p>
            ) : (
                <>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '20px', 
                        marginBottom: '30px' 
                    }}>
                        <div style={{ 
                            backgroundColor: '#e3f2fd', 
                            padding: '20px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: 0, color: '#1565c0' }}>📋 کل آنومالی‌ها</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
                                {stats.total}
                            </p>
                        </div>

                        <div style={{ 
                            backgroundColor: '#fff3e0', 
                            padding: '20px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: 0, color: '#e65100' }}>⏳ در انتظار بررسی</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
                                {stats.pending}
                            </p>
                        </div>

                        <div style={{ 
                            backgroundColor: '#fce4ec', 
                            padding: '20px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: 0, color: '#c62828' }}>🔴 بحرانی</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
                                {stats.critical}
                            </p>
                        </div>

                        <div style={{ 
                            backgroundColor: '#e8f5e9', 
                            padding: '20px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: 0, color: '#2e7d32' }}>✅ بسته شده</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
                                {stats.closed}
                            </p>
                        </div>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '20px' 
                    }}>
                        <div style={{ 
                            backgroundColor: 'white', 
                            padding: '20px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3>📈 وضعیت آنومالی‌ها</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                    <span>🟡 در حال انجام: </span>
                                    <strong>{stats.inProgress}</strong>
                                </li>
                                <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                    <span>🟢 رفع شده: </span>
                                    <strong>{stats.resolved}</strong>
                                </li>
                                <li style={{ padding: '8px 0' }}>
                                    <span>✅ بسته شده: </span>
                                    <strong>{stats.closed}</strong>
                                </li>
                            </ul>
                        </div>

                        <div style={{ 
                            backgroundColor: 'white', 
                            padding: '20px', 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h3>⚡ اقدامات سریع</h3>
                            <button
                                onClick={() => window.location.href = '/anomalies/new'}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    marginBottom: '10px'
                                }}
                            >
                                ➕ ثبت آنومالی جدید
                            </button>
                            <button
                                onClick={() => window.location.href = '/anomalies'}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#666',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                📋 مشاهده همه آنومالی‌ها
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;