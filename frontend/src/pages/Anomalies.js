import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Anomalies() {
    const navigate = useNavigate();
    const [anomalies, setAnomalies] = useState([]);
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExpert, setSelectedExpert] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchAnomalies();
        fetchExperts();
    }, []);

    const fetchAnomalies = () => {
        fetch('http://localhost:8000/api/anomalies/')
            .then(res => res.json())
            .then(data => {
                setAnomalies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    };

    const fetchExperts = () => {
        fetch('http://localhost:8000/api/experts/')
            .then(res => res.json())
            .then(data => setExperts(data))
            .catch(err => console.error('Error:', err));
    };

    const handleAction = async (id, action, extraData = null) => {
        try {
            let url = `http://localhost:8000/api/anomalies/${id}/${action}/`;
            let options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };

            if (extraData) {
                options.body = JSON.stringify(extraData);
            }

            const response = await fetch(url, options);
            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                fetchAnomalies();
            } else {
                alert(data.message || '❌ خطا در انجام عملیات!');
            }
        } catch (error) {
            alert('❌ خطا در اتصال به سرور!');
            console.error('Error:', error);
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'new': 'جدید',
            'approved': 'تأیید شده',
            'assigned': 'تخصیص داده شده',
            'in_progress': 'در حال انجام',
            'resolved': 'رفع شده',
            'closed': 'بسته شده',
            'rejected': 'رد شده'
        };
        return labels[status] || status;
    };

    const getStatusColor = (status) => {
        const colors = {
            'new': '#e3f2fd',
            'approved': '#fff3e0',
            'assigned': '#fce4ec',
            'in_progress': '#f3e5f5',
            'resolved': '#e8f5e9',
            'closed': '#c8e6c9',
            'rejected': '#ffebee'
        };
        return colors[status] || '#f5f5f5';
    };

    const getStatusTextColor = (status) => {
        const colors = {
            'new': '#0d47a1',
            'approved': '#e65100',
            'assigned': '#c62828',
            'in_progress': '#4a148c',
            'resolved': '#2e7d32',
            'closed': '#1b5e20',
            'rejected': '#b71c1c'
        };
        return colors[status] || '#333';
    };

    const getRiskLabel = (risk) => {
        const labels = {
            'low': 'کم',
            'medium': 'متوسط',
            'high': 'بالا',
            'critical': 'بحرانی'
        };
        return labels[risk] || risk;
    };

    const getRiskColor = (risk) => {
        const colors = {
            'low': '#e8f5e9',
            'medium': '#fff3e0',
            'high': '#fce4ec',
            'critical': '#ffebee'
        };
        return colors[risk] || '#f5f5f5';
    };

    const getRiskTextColor = (risk) => {
        const colors = {
            'low': '#2e7d32',
            'medium': '#e65100',
            'high': '#c62828',
            'critical': '#b71c1c'
        };
        return colors[risk] || '#333';
    };

    // ============ دسترسی‌ها بر اساس نقش ============
    const canApprove = user?.role === 'safety_supervisor' || user?.role === 'admin';
    const canAssign = user?.role === 'safety_supervisor' || user?.role === 'admin';
    const canResolve = user?.role === 'safety_expert' || 
                       user?.role === 'health_expert' || 
                       user?.role === 'environment_expert' || 
                       user?.role === 'admin';
    const canClose = user?.role === 'safety_supervisor' || user?.role === 'admin';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>📋 لیست آنومالی‌ها</h1>
                <button
                    onClick={() => navigate('/anomalies/new')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    ➕ ثبت آنومالی جدید
                </button>
            </div>

            {loading ? (
                <p>⏳ در حال بارگذاری...</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse', 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th style={{ padding: '12px', textAlign: 'right' }}>شماره</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>عنوان</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>مکان</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>سطح ریسک</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>وضعیت</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>ثبت‌کننده</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>تاریخ</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {anomalies.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        📭 هیچ آنومالی ثبت نشده است
                                    </td>
                                </tr>
                            ) : (
                                anomalies.map((anomaly) => (
                                    <tr key={anomaly.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px', fontSize: '13px', color: '#1976d2', fontWeight: 'bold' }}>
                                            {anomaly.anomaly_number || `ANO-${String(anomaly.id).padStart(3, '0')}`}
                                        </td>
                                        <td style={{ padding: '12px' }}>{anomaly.title}</td>
                                        <td style={{ padding: '12px' }}>{anomaly.location}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                backgroundColor: getRiskColor(anomaly.risk_level),
                                                color: getRiskTextColor(anomaly.risk_level),
                                                fontSize: '12px'
                                            }}>
                                                {getRiskLabel(anomaly.risk_level)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                backgroundColor: getStatusColor(anomaly.status),
                                                color: getStatusTextColor(anomaly.status),
                                                fontSize: '12px'
                                            }}>
                                                {getStatusLabel(anomaly.status)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px' }}>{anomaly.reported_by__username || 'نامشخص'}</td>
                                        <td style={{ padding: '12px', fontSize: '12px' }}>
                                            {anomaly.reported_at ? new Date(anomaly.reported_at).toLocaleDateString('fa-IR') : '-'}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                
                                                {/* مشاهده جزئیات - برای همه */}
                                                <button
                                                    onClick={() => navigate(`/anomalies/${anomaly.id}`)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: '#607d8b',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="مشاهده جزئیات و گردش کار"
                                                >
                                                    📋
                                                </button>

                                                {/* تأیید - فقط سرپرست */}
                                                {anomaly.status === 'new' && canApprove && (
                                                    <button
                                                        onClick={() => handleAction(anomaly.id, 'approve')}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#1976d2',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                        title="تأیید آنومالی"
                                                    >
                                                        ✅ تأیید
                                                    </button>
                                                )}

                                                {/* ارسال به کارشناس - فقط سرپرست */}
                                                {anomaly.status === 'approved' && canAssign && (
                                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                        <select
                                                            onChange={(e) => setSelectedExpert({...selectedExpert, [anomaly.id]: e.target.value})}
                                                            style={{
                                                                padding: '5px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #ddd',
                                                                fontSize: '11px',
                                                                maxWidth: '120px'
                                                            }}
                                                            defaultValue=""
                                                        >
                                                            <option value="">انتخاب</option>
                                                            {experts.map(expert => (
                                                                <option key={expert.id} value={expert.id}>
                                                                    {expert.username}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleAction(anomaly.id, 'assign', { expert_id: selectedExpert[anomaly.id] })}
                                                            style={{
                                                                padding: '5px 10px',
                                                                backgroundColor: '#ff9800',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '12px'
                                                            }}
                                                            disabled={!selectedExpert[anomaly.id]}
                                                            title="ارسال به کارشناس"
                                                        >
                                                            📌 ارسال
                                                        </button>
                                                    </div>
                                                )}

                                                {/* رفع - فقط کارشناس */}
                                                {anomaly.status === 'assigned' && canResolve && (
                                                    <button
                                                        onClick={() => handleAction(anomaly.id, 'resolve')}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#4caf50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                        title="رفع آنومالی"
                                                    >
                                                        🔧 رفع
                                                    </button>
                                                )}

                                                {/* بستن - فقط سرپرست */}
                                                {anomaly.status === 'resolved' && canClose && (
                                                    <button
                                                        onClick={() => {
                                                            const notes = prompt('✏️ یادداشت بسته شدن را وارد کنید (اختیاری):');
                                                            handleAction(anomaly.id, 'close', { closure_notes: notes || '' });
                                                        }}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#9c27b0',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                        title="بستن آنومالی"
                                                    >
                                                        🔒 بستن
                                                    </button>
                                                )}

                                                {anomaly.status === 'closed' && (
                                                    <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '12px' }}>
                                                        ✅ بسته شد
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Anomalies;