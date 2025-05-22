import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Cookies from 'js-cookie';
import InputField from '../../components/InputField';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const data = await res.json();
            const token = data.token;
            Cookies.set('user', JSON.stringify(data), {
                expires: 30,
                sameSite: 'Lax',
                secure: false
            });

            const decoded = jwtDecode(token);
            console.log(decoded.role);

            setTimeout(() => navigate('/'), 100);
        }
        else {
            alert('Invalid credentials');
        }
    } catch (err) {
        console.error('Login failed:', err);
        alert('Error during login');
    }
};



    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="form-container login-form">
                    <h2>Login</h2>
                    <form className="grid-form" onSubmit={handleLogin}>
                        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" />
                        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" />
                        <div className="full-width">
                            <button type="submit">Login</button>
                        </div>
                        <p className="auth-switch">
                            Don’t have an account? <span onClick={() => navigate('/register', { replace: true })} style={{ color: '#2a9d8f', cursor: 'pointer' }}><a>Register here</a></span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
