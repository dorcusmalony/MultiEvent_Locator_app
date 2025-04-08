const redis = require('../config/redis'); // Import Redis configuration
const WebSocket = require('ws'); // Import WebSocket library

const subscriber = redis.duplicate();
const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server on port 8080

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

const startConsumer = async () => {
  try {
    console.log('Listening for event updates...');
    await subscriber.subscribe('event_updates');

    subscriber.on('message', (channel, message) => {
      const update = JSON.parse(message);
      console.log('Event update received:', update);

      // Broadcast update to all WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(JSON.stringify(update));
          } catch (error) {
            console.error('Error broadcasting update to client:', error);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error in event update consumer:', error);
  }
};

startConsumer();
