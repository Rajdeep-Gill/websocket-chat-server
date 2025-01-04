const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Start the server
wss.on('listening', () => {
  console.log('Server is running on port 8080');
});

// Handle new client connections
wss.on('connection', (ws) => {
  console.log('A client connected');

  // Assign event handlers
  ws.on('message', (message) => handleMessage(ws, message));
  ws.on('close', () => handleDisconnection(ws));
});

// Function to handle incoming messages
function handleMessage(ws, message) {
  try {
    console.log('Received message:', message);
    const parsedMessage = JSON.parse(message.toString());
    console.log('Parsed message:', parsedMessage);

    switch (parsedMessage.type) {
      case 'join':
        handleJoin(ws, parsedMessage.message);
        break;
      case 'message':
        handleChatMessage(ws, parsedMessage.message);
        break;
      default:
        console.log('Unknown message type:', parsedMessage.type);
        console.log('Message:', parsedMessage.message);
        break;
    }

    console.log('Finished handling message');
  } catch (error) {
    console.error('Error parsing message:', error.message);
  }
}

// Function to handle when a client joins
function handleJoin(ws, name) {
  const time = new Date().toLocaleTimeString();
  ws.username = name || 'Anonymous';
  console.log(`[${time}] ${ws.username} has joined the chat room`);

  broadcast(
    `[${time}] ${ws.username} has joined the chat room`,
    'server-message',
    ws
  );
  console.log('Number of clients:', wss.clients.size);
  ws.send(JSON.stringify({ type: 'user-count', message: wss.clients.size }));
  broadcast(wss.clients.size, 'user-count'); // send to all including ws

  ws.send(
    JSON.stringify({
      type: 'server-message',
      message: 'Welcome to the chat room!',
    })
  );
  if (wss.clients.size > 1) {
    sendCurrentUsers(ws);
  }
}

function sendCurrentUsers(ws) {
  const currentUsers = Array.from(wss.clients)
    .filter((client) => client !== ws && client.username)
    .map((client) => client.username);

  ws.send(
    JSON.stringify({
      type: 'users',
      message: currentUsers.join(', '),
    })
  );
}

// Handle Chat Messages
function handleChatMessage(ws, message) {
  if (!ws.username) {
    console.log('Message received from unidentified client');
    return;
  }

  console.log(`Message from ${ws.username}: ${message}`);
  broadcast(`${ws.username}: ${message}`, 'chat-message', ws);
}

// Disconnect event handler
function handleDisconnection(ws) {
  console.log(`${ws.username || 'A client'} disconnected`);
  broadcast(
    `${ws.username || 'A client'} has left the chat room`,
    'server-message'
  );
  broadcast(wss.clients.size, 'user-count');
}

// Broadcast messages to all clients
function broadcast(message, msgType, excludeWs = null) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(JSON.stringify({ type: msgType, message: message }));
    }
  });
}
