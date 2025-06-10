import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const connectWebSocket = (courseIds, onMessage) => {
  const socket = new SockJS('http://localhost:8080/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      courseIds.forEach(courseId => {
        client.subscribe(`/topic/course/${courseId}/events`, (message) => {
          const body = JSON.parse(message.body);
          onMessage(body);
        });
      });
    }
  });

  client.activate();
  return client;
};

export default connectWebSocket;
