import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, onSnapshot } from 'firebase/firestore';
import SendIcon from '@mui/icons-material/Send';
import './Messages.css';

const Messaging = () => {  
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user == null) {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login?redirect=/messages');
      }
    }
  }, [user, loading]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const profilesRef = collection(db, 'profiles');
        const querySnapshot = await getDocs(profilesRef);
        
        const fetchedUsers = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(fetchedUser => fetchedUser.id !== user.uid);

        setUsers(fetchedUsers);
        console.log('Fetched users:', fetchedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleUserClick = async (otherUser) => {
    setSelectedUser(otherUser);
    setMessages([]); // Clear messages when a new user is selected
  
    // Query to find existing conversation
    const conversationQuery = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );
  
    const conversationSnapshot = await getDocs(conversationQuery);
    let existingConversation = null;
  
    conversationSnapshot.forEach(docSnapshot => {
      const conversationData = docSnapshot.data();
      if (conversationData.participants.includes(otherUser.id)) {
        existingConversation = { id: docSnapshot.id, ...conversationData };
      }
    });
  
    if (existingConversation) {
      // Conversation exists
      setConversationId(existingConversation.id);
  
      // Access the `messages` map directly
      const loadedMessages = existingConversation.messages ? Object.values(existingConversation.messages) : [];
      console.log("Loaded messages:", loadedMessages); // Debugging line
      setMessages(loadedMessages);
    } else {
      // Conversation does not exist, create a new one
      const newConversationRef = doc(collection(db, 'conversations'));
      await setDoc(newConversationRef, {
        participants: [user.uid, otherUser.id],
        messages: {} // Initialize messages as an empty object
      });
      setConversationId(newConversationRef.id);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !conversationId) return;

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      text: inputMessage,
      senderId: user.uid,
      timestamp: new Date(),
    });

    setInputMessage('');
  };

  return (
    <div className="messaging-container">
      <div className="user-list">
        <h2>Direct Messages</h2>
        {users.length > 0 ? (
          users.map((otherUser, index) => (
            <div
              key={index}
              className="user-item"
              onClick={() => handleUserClick(otherUser)}
            >
              <img
                src={
                  otherUser.pfpURL || 
                  "https://cdn.vectorstock.com/i/preview-2x/92/16/default-profile-picture-avatar-user-icon-vector-46389216.webp" // Default image if no profile picture URL
                }
                alt={`${otherUser.displayName || otherUser.firstName || 'Unknown'}'s avatar`}
                className="user-avatar"
              />

              {/* Display name */}
              <span className="user-name">
                {otherUser.displayName || 
                `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || 
                "Unknown User"}
              </span>
            </div>
          ))
        ) : (
          <p>No other users found.</p>
        )}
      </div>

      <div className="messages-container">
      <div className="messages">
        <h2>{selectedUser ? `Messages with ${selectedUser.displayName || selectedUser.firstName}` : 'Select a user'}</h2>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
              <span>{msg.senderId === user.uid ? 'You' : selectedUser.displayName || selectedUser.firstName}:</span> {msg.text}
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
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}><SendIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
