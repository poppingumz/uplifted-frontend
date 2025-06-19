import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('uplifted-notifications');
    return stored ? JSON.parse(stored) : [];
  });
  const [hasNew, setHasNew] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const raw = Cookies.get('user');
    if (!raw) return;

    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      console.error("❌ Invalid user cookie");
      return;
    }

    const interests = user.interests || [];
    if (!interests.length) return;

    // Use only one connection per first category
    const firstCategory = interests[0];
    const ws = new WebSocket(`ws://localhost:8080/ws/${firstCategory}`);

    let lastId = null;
    let lastTime = 0;

    ws.onopen = () => {
      console.log("✅ NotificationBell connected");
      interests.forEach(cat => {
        const subscribeMsg = JSON.stringify({ type: "SUBSCRIBE", category: cat });
        ws.send(subscribeMsg);
        console.log("📩 Subscribed to", cat);
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message || !data.category) return;

        const now = Date.now();
        if (data.courseId === lastId && now - lastTime < 3000) {
          console.log("⏩ Skipping duplicate notification");
          return;
        }
        lastId = data.courseId;
        lastTime = now;

        const newNoti = {
          id: data.courseId ?? now,
          text: data.message,
          category: data.category,
        };

        setNotifications(prev => {
          const exists = prev.some(n =>
            n.id === newNoti.id || (n.text === newNoti.text && n.category === newNoti.category)
          );
          if (exists) return prev;

          const updated = [newNoti, ...prev].slice(0, 10);
          localStorage.setItem('uplifted-notifications', JSON.stringify(updated));
          return updated;
        });

        setHasNew(true);
      } catch (err) {
        console.error("⚠️ Notification parse error", err);
      }
    };

    ws.onerror = (err) => console.error("❌ WS Error", err);
    ws.onclose = () => console.log("🔌 NotificationBell WebSocket closed");

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  const handleBellClick = () => {
    setDropdownVisible(!dropdownVisible);
    setHasNew(false);
  };

  const handleClear = () => {
    setNotifications([]);
    localStorage.removeItem('uplifted-notifications');
    setDropdownVisible(false);
  };

  return (
    <div className="notif-bell-container">
      <div className="notif-bell" onClick={handleBellClick}>
        🔔
        {hasNew && <span className="notif-dot" />}
      </div>
      {dropdownVisible && (
        <div className="notif-dropdown">
          <div className="notif-scroll">
            {notifications.length === 0 ? (
              <div className="notif-item">No notifications</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="notif-item">📢 {n.text}</div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <button className="notif-clear-btn" onClick={handleClear}>
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
