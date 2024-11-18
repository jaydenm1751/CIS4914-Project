import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDoc, getDocs, doc, setDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
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
  }, [user, loading, navigate]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Fetch conversations to get users who have active conversations with the current user
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        const conversationsRef = collection(db, `users/${user.uid}/conversations`);
        console.log("Conversations Reference: ", conversationsRef);
        const conversationsSnapshot = await getDocs(conversationsRef);
        if (conversationsSnapshot.empty) {
          console.log("No conversations found for this user."); // Debug: Check if collection is empty
        } else {
          console.log("Conversations Snapshot Size:", conversationsSnapshot.size); // Debug: Check snapshot size
        }
  

        const participantIds = [];
        conversationsSnapshot.forEach((docSnapshot) => {
          const conversationData = docSnapshot.data();
          console.log("Conversation Document ID:", docSnapshot.id); // Debugging line
          console.log("Conversation Data:", conversationData);
          
          if (conversationData.participants){
            conversationData.participants.forEach((participantId) => {
              if (participantId !== user.uid) { // Exclude the current user’s ID
                participantIds.push(participantId);
              }
            });
          } else {
            console.warn(`Conversation ${docSnapshot.id} has no participants array`);
          }
        });

        // Fetch user profiles for each participant
        const profilesRef = collection(db, 'profiles');
        const fetchedUsers = [];
        for (const participantId of participantIds) {
          console.log(`Fetching profile for participant ID: ${participantId}`);
          const participantDocRef = doc(profilesRef, participantId);
          const participantDoc = await getDoc(participantDocRef);
          console.log("Participant Document:", participantDoc); // Debugging line

          if (participantDoc.exists()) {
            fetchedUsers.push({ id: participantId, ...participantDoc.data() });
          }
        }

        setUsers(fetchedUsers);
        console.log('Fetched users with conversations:', fetchedUsers);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [user]);

  const handleUserClick = async (otherUser) => {
    setSelectedUser(otherUser);
    setMessages([]); // Clear messages when a new user is selected

    // Reference to the specific conversation document
    const conversationRef = doc(db, `users/${user.uid}/conversations/${otherUser.id}`);

    // Fetch the conversation document
    const conversationDoc = await getDoc(conversationRef);
    if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data();

        // Debugging output
        console.log("Conversation data:", conversationData);

        // Assuming `messages` is a map field with a structure similar to: { messageId1: { text, senderId, timestamp }, ... }
        const loadedMessages = conversationData.messages
            ? Object.values(conversationData.messages)  // Convert map to an array
            : [];

        console.log("Loaded messages from map field:", loadedMessages);
        setMessages(loadedMessages);
    } else {
        console.log("No conversation found.");
        setMessages([]);
    } 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  //messages.js sendMessage
  const handleSendMessage = async () => {
    console.log("logged in user id: ", user.uid);
    if (inputMessage.trim() === '' || !selectedUser || !user) return;

    try {
        // Path for the conversation subcollection within the user's document
        const conversationRef = doc(db, `users/${user.uid}/conversations/${selectedUser.id}`);

        // Debug statement
        console.log(`Saving to path: users/${user.uid}/conversations/${selectedUser.id}`);
        // const messageKey = `msg_${new Date().getTime()}`;
        // Create the new message object
        const newMessage = {
            text: inputMessage,
            senderId: user.uid,
            receiverId: selectedUser.id,
            timestamp: new Date(),
        };

        // Use `setDoc` to create or update the conversation document
        await updateDoc(conversationRef, { 
            messages: arrayUnion(newMessage)
        });

        // Add the message to the `messages` subcollection within the conversation
        // Debug statement
        console.log("Message sent:", newMessage);


        // Update local state for messages
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputMessage('');
    } catch (error) {
        console.error("Error sending message:", error);
    }
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
            messages.map((msg, index) => {
              // console.log("Message object:", msg);
              const isSentByUser = msg.senderId === user.uid;
              // console.log(msg.senderId);
              return (
              <div key={index} className={`message ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
                <span>{isSentByUser ? 'You' : selectedUser.displayName || selectedUser.firstName}:</span> {msg.text}
              </div>
              );
            })
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
