import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, setDoc, onSnapshot, orderBy } from 'firebase/firestore';
import './Messages.css';

const Messaging = () => {  
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login?redirect=/messages');
      } else {
        console.log('User is logged in: ', user );
      }
    }
  }, [user, loading, navigate]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch other users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        const fetchedUsers = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(fetchedUser => fetchedUser.id !== user.uid);

        console.log('Fetched users:', fetchedUsers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Function to get or create a conversation
  const handleUserClick = async (otherUser) => {
    setSelectedUser(otherUser);
    setMessages([]); // Clear messages when a new user is selected

    console.log('Selected user:', otherUser);

    const conversationQuery = query(
      collection(db, 'conversations'),
      where('users', 'array-contains', user.uid)
    );

    const conversationSnapshot = await getDocs(conversationQuery);
    let existingConversation = null;

    conversationSnapshot.forEach(docSnapshot => {
      const conversationData = docSnapshot.data();
      console.log('Checking conversation data:', conversationData);
      if (conversationData.users.includes(otherUser.id)) {
        existingConversation = { id: docSnapshot.id, ...conversationData };
      }
    });

    if (existingConversation) {
      console.log('Existing conversation found:', existingConversation);
      setConversationId(existingConversation.id);

      // Set up a real-time listener for messages
      const messagesRef = collection(db, 'conversations', existingConversation.id, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp')); // Order messages by timestamp
      onSnapshot(messagesQuery, (snapshot) => {
        const loadedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Loaded messages:', loadedMessages);
        setMessages(loadedMessages);
      });
    } else {
      // Conversation does not exist, create a new one
      const newConversationRef = doc(collection(db, 'conversations'));
      console.log('No conversation found, creating a new one.');
      await setDoc(newConversationRef, {
        users: [user.uid, otherUser.id],
      });
      setConversationId(newConversationRef.id);
    }
  };

  // Send a message
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
        <h2>Users</h2>
        {users.length > 0 ? (
          users.map((otherUser, index) => (
            <div
              key={index}
              className="user-item"
              onClick={() => handleUserClick(otherUser)}
            >
              {otherUser.displayName || 'Unknown User'}
            </div>
          ))
        ) : (
          <p>No other users found.</p>
        )}
      </div>

      <div className="messages-container">
        <div className="messages">
          <h2>{selectedUser ? `Messages with ${selectedUser.displayName}` : 'Select a user'}</h2>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
                {msg.text}
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
