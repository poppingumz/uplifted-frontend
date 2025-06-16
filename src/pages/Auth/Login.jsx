import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Cookies from 'js-cookie';
import InputField from '../../components/InputField';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate                = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email.trim(),
    password: password.trim()
  })
});


      if (!res.ok) {
        return alert('Invalid credentials');
      }

      const data = await res.json();

Cookies.set('user',
  JSON.stringify({
    id:       data.id,
    username: data.username,
    email:    data.email,
    role:     data.role,
    token:    data.token
  }),
  { expires: 30, path: '/', sameSite: 'Lax' }
);

      navigate('/account');
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
          <form className="grid-form" data-cy="login-form" onSubmit={async (e) => await handleLogin(e)}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className="full-width">
              <button type="submit" data-cy="login-button">Login</button>
            </div>
            <p className="auth-switch">
              Don’t have an account?{' '}
              <Link to="/register" replace data-cy="register-link" style={{ color: '#2a9d8f' }}>
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
