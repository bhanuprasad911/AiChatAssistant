import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from './services/chatService';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(localStorage.getItem('chat_session_id') || '');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      const newId = uuidv4();
      localStorage.setItem('chat_session_id', newId);
      setSessionId(newId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      chatService.getHistory(sessionId)
        .then(data => setMessages(data))
        .catch(err => console.error("History failed:", err));
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const data = await chatService.sendMessage(sessionId, input);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Could not reach the server." }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    const newId = uuidv4();
    localStorage.setItem('chat_session_id', newId);
    setSessionId(newId);
    setMessages([]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>AI Support</h1>
        <button onClick={startNewChat} className="new-chat-btn">New Chat</button>
      </header>

      <main className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`message-bubble ${m.role}`}>
            <p>{m.content}</p>
          </div>
        ))}
        {loading && <div className="message-bubble assistant loading">...</div>}
        <div ref={messagesEndRef} />
      </main>

      <form onSubmit={handleSend} className="input-area">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default App;