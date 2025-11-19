import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import io from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('general');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join-room', activeRoom);

    newSocket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => newSocket.close();
  }, [activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        roomId: activeRoom,
        user: user.firstName,
        message: newMessage,
        timestamp: new Date()
      };
      
      socket.emit('send-message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chat</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 h-96">
            {/* Sidebar */}
            <div className="col-span-1 bg-gray-50 border-r">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Chat Rooms</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveRoom('general')}
                  className={`w-full text-left p-2 rounded ${
                    activeRoom === 'general' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  General Support
                </button>
                <button
                  onClick={() => setActiveRoom('emergency')}
                  className={`w-full text-left p-2 rounded ${
                    activeRoom === 'emergency' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Emergency
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-3 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.user === user.firstName ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.user === user.firstName
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="font-semibold text-sm">{msg.user}</div>
                      <div>{msg.message}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={sendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;