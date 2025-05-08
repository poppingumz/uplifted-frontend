import React from 'react';

const SelectField = ({ label, value, onChange, options, name, required = true }) => {
    return (
        <div className="form-group select-field">
            <label>{label}</label>
            <div className="custom-select-wrapper">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="custom-select"
                >
                    <option value="">Select {label}</option>
                    {options.map(opt => (
                        <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <span className="select-arrow">&#9662;</span>
            </div>
        </div>
    );
};

export default SelectField;
