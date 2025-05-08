import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerField = ({ label, name, value, onChange }) => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, 0, 1);
    const maxDate = new Date(today.getFullYear() - 12, 11, 31);

    return (
        <div className="form-group">
            <label>{label}</label>
            <DatePicker
                selected={value ? new Date(value) : null}
                onChange={(date) => onChange({ target: { name, value: date.toISOString().split('T')[0] } })}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select your date of birth"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={minDate}
                maxDate={maxDate}
                className="custom-datepicker"
            />
        </div>
    );
};

export default DatePickerField;
