import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

function Layout() {
    const navigate = useNavigate();
    
    // دریافت اطلاعات کاربر از localStorage
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    // نمایش نام نقش به فارسی
    const getRoleLabel = (role) => {
        const roles = {
            'admin': 'مدیر سیستم',
            'safety_supervisor': 'سرپرست ایمنی',
            'safety_expert': 'کارشناس ایمنی',
            'health_expert': 'کارشناس بهداشت حرفه‌ای',
            'environment_expert': 'کارشناس محیط زیست',
            'operator': 'کاربر عادی'
        };
        return roles[role] || role;
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{
                width: '250px',
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '20px',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                overflowY: 'auto',
                zIndex: 1000
            }}>
                <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>🛡️ ISO</h2>
                
                <nav>
                    <div style={{ marginBottom: '15px' }}>
                        <Link to="/dashboard" style={{ 
                            color: 'white', 
                            textDecoration: 'none',
                            display: 'block',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            transition: 'background 0.3s'
                        }}>
                            📊 داشبورد
                        </Link>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <Link to="/anomalies" style={{ 
                            color: 'white', 
                            textDecoration: 'none',
                            display: 'block',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            transition: 'background 0.3s'
                        }}>
                            ⚠️ آنومالی‌ها
                        </Link>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <Link to="/anomalies/new" style={{ 
                            color: 'white', 
                            textDecoration: 'none',
                            display: 'block',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            transition: 'background 0.3s'
                        }}>
                            ➕ ثبت آنومالی
                        </Link>
                    </div>
                </nav>

                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px'
                }}>
                    <hr style={{ borderColor: 'rgba(255,255,255,0.2)', marginBottom: '10px' }} />
                    <div style={{ fontSize: '12px', color: '#90caf9' }}>
                        <div>👤 {user?.username || 'کاربر'}</div>
                        <div>📌 {user ? getRoleLabel(user.role) : 'کاربر'}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '8px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            fontSize: '14px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        🚪 خروج
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: '250px',
                flex: 1,
                padding: '30px',
                backgroundColor: '#f5f7fa',
                minHeight: '100vh'
            }}>
                {/* هدر */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '15px 20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            🚀 سیستم مدیریت ایمنی
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        {user && (
                            <span>
                                👤 {user.username} 
                                <span style={{ 
                                    backgroundColor: '#e3f2fd', 
                                    padding: '3px 10px', 
                                    borderRadius: '12px',
                                    marginLeft: '10px',
                                    fontSize: '12px',
                                    color: '#1976d2'
                                }}>
                                    {getRoleLabel(user.role)}
                                </span>
                            </span>
                        )}
                    </div>
                </div>

                {/* محتوای صفحات */}
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;