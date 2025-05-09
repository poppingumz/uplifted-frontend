import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import DatePickerField from '../../components/DatePickerField';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        dateOfBirth: ''
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, ...rest } = formData;

        if (password !== confirmPassword) {
            return alert('Passwords do not match');
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...rest,
                    password,
                    firstName: formData.firstname,
                    lastName: formData.lastname
                  })
                  
            });

            if (res.ok) {
                navigate('/login');
            } else {
                const data = await res.json();
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Register error:', err);
            alert('Something went wrong');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="form-container">
                    <h2>Register</h2>
                    <form className="grid-form" onSubmit={handleSubmit}>
                        <InputField label="First Name" name="firstname" value={formData.firstname} onChange={handleChange} type="text" />
                        <InputField label="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} type="text" />
                        <InputField label="Username" name="username" value={formData.username} onChange={handleChange} type="text" />
                        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                        <InputField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
                        <InputField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" />
                        <SelectField label="Role" name="role" value={formData.role} onChange={handleChange} options={['STUDENT', 'TEACHER']} />
                        <DatePickerField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                        <div className="full-width">
                            <button type="submit">Register</button>
                        </div>
                        <p className="auth-switch">
                            Already registered? <span onClick={() => navigate('/login', { replace: true })} style={{ color: '#2a9d8f', cursor: 'pointer' }}>Login here</span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
