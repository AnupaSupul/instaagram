import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'register') {
      clients.set(message.userId, ws);
      console.log(`User ${message.userId} registered`);
      return;
    }

    if (message.type === 'chat') {
      const receiver = clients.get(message.receiverId);

      if (receiver && receiver.readyState === WebSocket.OPEN) {
        receiver.send(JSON.stringify(message));
      }
    }
  });

  ws.on('close', () => {
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }
  });
});

console.log('WebSocket server running on ws://localhost:3001');