import React, { useState } from 'react';
import './Messages.css';

const Messaging = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState('');


  const users = {
    'User 1': [
      { text: 'Testing received message', type: 'received' },
      { text: 'Testing sent message', type: 'sent' },
    ],
    'User 2': [
      { text: 'Testing user2 message', type: 'received' },
      { text: 'Testing user2 sent message', type: 'sent' },
    ],
    'User 3': [
      { text: 'User3 message', type: 'received' },
    ],
  };

  const [messages, setMessages] = useState([]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages(users[user] || []); 
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, type: 'sent' }]);
      setInputMessage(''); 
    }
  };

  return (
    <div className="messaging-container">
      <div className="user-list">
        <h2>Users</h2>
        {Object.keys(users).map((user, index) => (
          <div
            key={index}
            className="user-item"
            onClick={() => handleUserClick(user)}
          >
            {user}
          </div>
        ))}
      </div>

      <div className="messages-container">
        <div className="messages">
          <h2>{selectedUser ? `Messages with ${selectedUser}` : 'Select a user'}</h2>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'received' ? selectedUser : 'You'}: {msg.text}
              </div>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
        </div>

        <div className="send-message">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
