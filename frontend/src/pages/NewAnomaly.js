import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewAnomaly() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        risk_level: 'medium',
        attachment: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, attachment: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('location', form.location);
            formData.append('risk_level', form.risk_level);
            if (form.attachment) {
                formData.append('attachment', form.attachment);
            }

            const response = await fetch('http://localhost:8000/api/anomalies/create/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('✅ آنومالی با موفقیت ثبت شد!');
                navigate('/anomalies');
            } else {
                alert(data.message || '❌ خطا در ثبت آنومالی');
            }
        } catch (error) {
            alert('❌ خطا در اتصال به سرور!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>⚠️ ثبت آنومالی جدید</h1>
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>عنوان *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>توضیحات *</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>مکان *</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>سطح ریسک</label>
                    <select
                        name="risk_level"
                        value={form.risk_level}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                        <option value="low">🟢 کم</option>
                        <option value="medium">🟡 متوسط</option>
                        <option value="high">🟠 بالا</option>
                        <option value="critical">🔴 بحرانی</option>
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>📷 آپلود عکس</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: loading ? '#90a4ae' : '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '⏳ در حال ثبت...' : '📝 ثبت آنومالی'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/anomalies')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ❌ انصراف
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewAnomaly;