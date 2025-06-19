import { useEffect } from 'react';
import Cookies from 'js-cookie';

const WebSocketHandler = () => {
  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) return;

    const user = JSON.parse(userCookie);
    const interests = user?.interests || [];
    if (!interests.length) return;

    const firstCategory = interests[0];
    const ws = new WebSocket(`ws://localhost:8080/ws/${firstCategory}`);

    let lastId = null;
    let lastTime = 0;

    ws.onopen = () => {
      console.log('Connected to native WebSocket');
      interests.forEach(cat => {
        const subscribeMessage = JSON.stringify({ type: 'SUBSCRIBE', category: cat });
        ws.send(subscribeMessage);
        console.log('Sent subscription for', cat);
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message || !data.category) return;
        if (!data.message.startsWith("📢")) return;

        const now = Date.now();
        if (data.courseId === lastId && now - lastTime < 3000) {
          console.log('Skipping duplicate notification');
          return;
        }
        lastId = data.courseId;
        lastTime = now;

        const newNotif = {
          id: data.courseId ?? now,
          text: data.message,
          category: data.category,
        };

        const saved = localStorage.getItem('uplifted-notifications');
        const parsed = saved ? JSON.parse(saved) : [];
        const exists = parsed.some(n =>
          n.id === newNotif.id ||
          (n.text === newNotif.text && n.category === newNotif.category)
        );

        if (!exists) {
          const updated = [newNotif, ...parsed].slice(0, 10);
          localStorage.setItem('uplifted-notifications', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Failed to handle WebSocket message', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket Error', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  return null;
};

export default WebSocketHandler;
