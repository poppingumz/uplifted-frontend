import React from 'react';

const InputField = ({ label, type, value, onChange, name, required = true }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default InputField;
