let socket; // Declare the socket variable

// Function to create a new WebSocket connection
const createConnection = (name) => {
  const ws = new WebSocket('ws://localhost:8080');

  // Define WebSocket event handlers
  ws.onopen = () => handleOpen(ws, name);
  ws.onmessage = (event) => handleMessage(event);
  ws.onclose = () => handleClose();
  ws.onerror = (error) => handleError(error);

  return ws;
};

// Handle WebSocket open event
const handleOpen = (ws, name) => {
  console.log('Connected to the server');
  sendMessage(ws, { type: 'join', message: name });
};

// Handle incoming messages
const handleMessage = (event) => {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case 'users':
      console.log('Current users:', message.message);
      break;
    case 'server-message':
      console.log('Server message:', message.message);
      handleServerMessage(message.message);
      break;
    case 'chat-message':
      console.log('Chat message:', message.message);
      handleChatMessage(message.message);
      break;
    case 'user-count':
      console.log('User count:', message.message);
      handleUserCountDisplay(message.message);
      break;
    default:
      console.log('Unknown message type:', message.type);
      console.log('Message:', message.message);
  }
};

function handleUserCountDisplay(message) {
  const userCountElement = document.getElementById('user-count');
  //edit div text
  userCountElement.textContent = 'Users Online: ' + message;
}

// Handle WebSocket close event
const handleClose = () => {
  console.log('Connection closed');
};

// Handle WebSocket error event
const handleError = (error) => {
  console.error(`WebSocket error: ${error.message}`);
};

// Function to send a message through WebSocket
const sendMessage = (ws, message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.log('WebSocket is not connected');
  }
};

// Handle form submission
const handleFormSubmit = (e) => {
  e.preventDefault(); // Prevent page refresh
  const nameInput = document.getElementById('name');
  const name = nameInput.value.trim();

  if (!name) {
    console.log('Please enter a valid name');
    return;
  }

  // Create a new WebSocket connection only if the user is not connected
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('You are already connected');
    return;
  } else if (socket && socket.readyState === WebSocket.CONNECTING) {
    console.log('Connection is in progress');
    return;
  }
  socket = createConnection(name);
};

function handleDisconnection() {
  if (socket) {
    socket.close();
    socket = null;
  } else {
    console.log('WebSocket is not connected');
    alert('WebSocket is not connected');
  }
}

function handleServerMessage(message) {
  const serverMessagebox = document.getElementById('server-message');
  serverMessagebox.innerHTML = 'Announcement: ' + message;
  // Remove this after 5 seconds
  setTimeout(() => {
    serverMessagebox.innerHTML = '';
  }, 5000);
}

function handleChatMessage(message) {
  const chatMessageBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className =
    'bg-gray-100 text-gray-800 p-2 rounded-lg m-1 self-start max-w-xs';

  const timestampElement = document.createElement('div');
  const timestamp = new Date().toLocaleTimeString();
  timestampElement.textContent = timestamp;
  timestampElement.className = 'text-gray-500 text-xs mt-1';

  messageElement.appendChild(timestampElement);
  chatMessageBox.appendChild(messageElement);
  chatMessageBox.scrollTop = chatMessageBox.scrollHeight;

  const mainBox = document.getElementById('main-box');
  mainBox.scrollTop = mainBox.scrollHeight;

  console.log('Chat message:', message);
}

function handleUserMessageSubmit(e) {
  e.preventDefault();
  // get the form values
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  // Place it on the right side of the chat box
  const chatMessageBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className =
    'bg-blue-100 text-blue-800 p-2 rounded-lg m-1 self-end max-w-xs';
  const timestampElement = document.createElement('div');
  const timestamp = new Date().toLocaleTimeString();
  timestampElement.textContent = timestamp;
  timestampElement.className = 'text-gray-500 text-xs mt-1';
  messageElement.appendChild(timestampElement);
  chatMessageBox.appendChild(messageElement);

  const mainBox = document.getElementById('main-box');
  mainBox.scrollTop = mainBox.scrollHeight;

  sendMessage(socket, { type: 'message', message: message });
}

// Attach event listeners to the form and ping button
const init = () => {
  const userForm = document.getElementById('connection-form');
  const disconnectButton = document.getElementById('disconnect-button');
  const userMessageForm = document.getElementById('message-form');

  userForm.addEventListener('submit', handleFormSubmit);
  disconnectButton.addEventListener('click', handleDisconnection);
  userMessageForm.addEventListener('submit', handleUserMessageSubmit);
};

// Initialize the application
init();
