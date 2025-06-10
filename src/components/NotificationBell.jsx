// src/components/NotificationBell.jsx
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('uplifted-notifications');
    return stored ? JSON.parse(stored) : [];
  });
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    // Read interests directly from cookie
    const raw = Cookies.get('user');
    if (!raw) {
      console.warn("🟡 No user cookie for NotificationBell");
      return;
    }
    let user;
    try {
      user = JSON.parse(raw);
    } catch {
      console.error("❌ Invalid user cookie JSON");
      return;
    }
    const interests = user.interests || [];
    if (!interests.length) {
      console.warn("🟡 No interests for NotificationBell");
      return;
    }

    console.log("🔔 NotificationBell connecting for interests:", interests);
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      debug: (msg) => console.log('📡 Bell STOMP DEBUG:', msg),
    });

    client.onConnect = () => {
      console.log("✅ Bell STOMP connected");
      interests.forEach(category => {
        const topic = `/topic/category/${category}`;
        console.log("📡 Bell subscribing to:", topic);
        client.subscribe(topic, msg => {
          console.log("📬 Bell raw message:", msg.body);
          try {
            const data = JSON.parse(msg.body);
            console.log("📬 Bell parsed:", data);
            const newNoti = { id: Date.now(), text: data.message };
            setNotifications(prev => {
              const updated = [newNoti, ...prev].slice(0, 10);
              localStorage.setItem('uplifted-notifications', JSON.stringify(updated));
              return updated;
            });
            setHasNew(true);
          } catch (e) {
            console.error("❌ Bell JSON parse error:", e);
          }
        });
      });
    };

    client.onStompError = frame => console.error("❌ Bell STOMP error:", frame);
    client.onWebSocketError = evt => console.error("❌ Bell WS error:", evt);

    client.activate();
    return () => client.deactivate();
  }, []);

  const handleClick = () => {
    setHasNew(false);
    const text = notifications.map(n => `📢 ${n.text}`).join('\n');
    alert(text || 'No notifications');
  };

  return (
    <div className="notif-bell" onClick={handleClick}>
      🔔
      {hasNew && <span className="notif-dot" />}
    </div>
  );
};

export default NotificationBell;
