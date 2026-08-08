import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AnomalyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anomaly, setAnomaly] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://safety-backend-69dl.onrender.com/api/anomalies/${id}/')
            .then(res => res.json())
            .then(data => {
                setAnomaly(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, [id]);

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

    const getRiskLabel = (risk) => {
        const labels = {
            'low': 'کم',
            'medium': 'متوسط',
            'high': 'بالا',
            'critical': 'بحرانی'
        };
        return labels[risk] || risk;
    };

    if (loading) return <p>⏳ در حال بارگذاری...</p>;
    if (!anomaly) return <p>❌ آنومالی یافت نشد!</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>📋 {anomaly.anomaly_number}</h1>
                <button
                    onClick={() => navigate('/anomalies')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ← بازگشت
                </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginBottom: '15px' }}>{anomaly.title}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><strong>شماره:</strong> {anomaly.anomaly_number}</div>
                    <div>
                        <strong>وضعیت:</strong> 
                        <span style={{ 
                            backgroundColor: getStatusColor(anomaly.status), 
                            padding: '4px 12px', 
                            borderRadius: '12px',
                            marginRight: '8px'
                        }}>
                            {getStatusLabel(anomaly.status)}
                        </span>
                    </div>
                    <div><strong>مکان:</strong> {anomaly.location}</div>
                    <div><strong>سطح ریسک:</strong> {getRiskLabel(anomaly.risk_level)}</div>
                    <div><strong>ثبت‌کننده:</strong> {anomaly.reported_by || 'نامشخص'}</div>
                    <div><strong>تاریخ ثبت:</strong> {anomaly.reported_at}</div>
                    {anomaly.assigned_to && <div><strong>تخصیص به:</strong> {anomaly.assigned_to}</div>}
                    {anomaly.approved_by && <div><strong>تأییدکننده:</strong> {anomaly.approved_by}</div>}
                    {anomaly.closed_by && <div><strong>بسته‌کننده:</strong> {anomaly.closed_by}</div>}
                    {anomaly.closed_at && <div><strong>تاریخ بسته شدن:</strong> {anomaly.closed_at}</div>}
                </div>
                
                <div style={{ marginTop: '15px' }}>
                    <strong>📝 توضیحات:</strong>
                    <p style={{ marginTop: '5px', lineHeight: '1.8', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        {anomaly.description}
                    </p>
                </div>

                {anomaly.attachment && (
                    <div style={{ marginTop: '15px' }}>
                        <strong>📷 عکس پیوست:</strong>
                        <br />
                        <img 
                            src={`https://safety-backend-69dl.onrender.com${anomaly.attachment}`} 
                            alt="Anomaly" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '400px', 
                                marginTop: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                display: 'block'
                            }} 
                        />
                    </div>
                )}

                {anomaly.closure_notes && (
                    <div style={{ 
                        marginTop: '15px', 
                        backgroundColor: '#e8f5e9', 
                        padding: '15px', 
                        borderRadius: '8px',
                        border: '1px solid #c8e6c9'
                    }}>
                        <strong>📝 یادداشت بسته شدن:</strong>
                        <p style={{ marginTop: '5px' }}>{anomaly.closure_notes}</p>
                    </div>
                )}
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>⏳ گردش کار</h3>
                <div style={{ position: 'relative', padding: '10px 0' }}>
                    {anomaly.timeline && anomaly.timeline.length > 0 ? (
                        anomaly.timeline.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    backgroundColor: index === anomaly.timeline.length - 1 ? '#4caf50' : '#1976d2',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    marginLeft: '15px',
                                    flexShrink: 0
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{item.status}</div>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        {item.user} - {item.time}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#666' }}>هیچ گردش کاری ثبت نشده است</p>
                    )}
                    
                    {anomaly.status === 'closed' && (
                        <div style={{ 
                            marginTop: '15px', 
                            padding: '15px', 
                            backgroundColor: '#e8f5e9', 
                            borderRadius: '8px',
                            border: '1px solid #c8e6c9'
                        }}>
                            <strong style={{ color: '#2e7d32' }}>✅ این آنومالی بسته شده است.</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnomalyDetail;