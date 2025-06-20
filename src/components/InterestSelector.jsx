import React, { useState } from 'react';
import Cookies from 'js-cookie';
import '../styles/interest-selector.css';

const COURSE_CATEGORIES = [
  'PROGRAMMING', 'DESIGN', 'BUSINESS', 'MARKETING', 'SCIENCE',
  'LANGUAGE', 'GAMING', 'MUSIC', 'ART', 'HEALTH', 'MATH',
  'TECHNOLOGY', 'OTHER'
];

const InterestSelector = ({ selected, setSelected }) => {
  const [current, setCurrent] = useState('');

  const syncInterestsToCookie = (updated) => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        user.interests = updated;
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        console.log("Synced interests to cookie:", updated);
      } catch (e) {
        console.error("Failed to update interests in cookie:", e);
      }
    } else {
      console.warn("No user cookie found when trying to sync interests.");
    }
  };

  const addCategory = () => {
    if (current && !selected.includes(current)) {
      const updated = [...selected, current];
      setSelected(updated);
      localStorage.setItem('interests', JSON.stringify(updated));
      syncInterestsToCookie(updated);
      console.log("Interest added:", current);
      setCurrent('');
    }
  };

  const removeCategory = (category) => {
    const updated = selected.filter(c => c !== category);
    setSelected(updated);
    localStorage.setItem('interests', JSON.stringify(updated));
    syncInterestsToCookie(updated);
    console.log("Interest removed:", category);
  };

  const clearNotifications = () => {
    localStorage.removeItem('uplifted-notifications');
    console.log("All notifications cleared");
  };

  return (
    <div className="interest-selector">
      <h3 className="interest-title">Select Your Interests</h3>

      <div className="interest-controls">
        <select
          className="interest-dropdown"
          value={current}
          onChange={e => setCurrent(e.target.value)}
        >
          <option value="">-- Choose Category --</option>
          {COURSE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          className="interest-add-btn"
          onClick={addCategory}
          disabled={!current}
        >
          + Add
        </button>
      </div>

      <ul className="interest-list">
        {selected.length === 0 && (
          <li className="interest-none">No interests selected.</li>
        )}
        {selected.map(cat => (
          <li key={cat} className="interest-item">
            {cat}
            <button
              className="interest-remove-btn"
              onClick={() => removeCategory(cat)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      {/* Clear Notifications Button */}
      <button
        className="clear-notis-btn"
        onClick={clearNotifications}
      >
        Clear Notifications
      </button>
    </div>
  );
};

export default InterestSelector;
