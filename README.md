# WebSocket Chat Application

## Description

This is a simple WebSocket-based chat application where users can connect, send messages, and see messages from other connected users in real-time. The application is built using HTML, JavaScript, and Node.js with WebSockets.

### Features:
- Real-time chat functionality.
- Dynamic display of the number of users online.
- Server announcements for user join/leave events.
- Friendly UI designed with TailwindCSS.

## How It Works

1. **Server**: The WebSocket server (`server.js`) handles connections, broadcasting messages, and user events.
2. **Client**: The client-side script (`script.js`) manages user interactions, establishes WebSocket connections, and updates the UI dynamically.
3. **Interface**: The HTML file (`index.html`) provides a clean, responsive user interface for the chat.

---

## Getting Started

### Prerequisites
- Node.js installed on your system.

### Installation
1. Clone this repository or download the files.
2. Navigate to the project folder.
3. Install the necessary packages:
   ```bash
   npm install ws
   ```
### Running the server
1. Once node is installed, run
  ```bash
    node server/server.js
  ```
The Server is now running and all events will be logged to the server

### Using the Application
1. Open the `index.html` file in your browser.
2. Enter your name in the input field and click "Connect."
3. If it's running locally, open a new instance to connext another _user_
---

### Future Enhancements
- Deploy the server for public access.
- Improve error handling and notifications.
- Add more chat rooms, and the ability to create a chat room
