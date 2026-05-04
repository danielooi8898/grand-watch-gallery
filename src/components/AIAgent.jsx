'use client';

import { useState, useRef, useEffect } from 'react';

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'agent', content: 'Hello! I\'m Claude, your AI assistant for Grand Watch Gallery. I have access to your complete inventory data and can provide detailed analysis on stocks, pricing, market trends, competitive positioning, and business insights. Ask me about anything related to your watch inventory, pricing strategy, market opportunities, or business performance. What would you like to know?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const COLORS = {
    gold: '#B08D57',
    dark: '#0A0A0A',
    darkBorder: '#1A1A1A',
    lightBg: '#F7F6F3',
    lightText: '#5C5C5C',
    darkText: '#0A0A0A',
    white: '#ffffff',
    chatBg: '#0A0A0A',
    messageBg: '#1A1A1A',
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Query Claude API with inventory context
  const processQuery = async (query) => {
    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Query error:', error);
      return `I encountered an error processing your query: ${error.message}. Please try again or rephrase your question.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(async () => {
      const agentResponse = await processQuery(inputValue);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'agent',
        content: agentResponse,
      }]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: COLORS.gold,
          color: COLORS.dark,
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold',
          zIndex: 998,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.95)' : 'scale(1)',
        }}
        title="Open AI Assistant"
      >
        AI
      </button>

      {/* Slide-out Panel */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: COLORS.chatBg,
          borderLeft: `2px solid ${COLORS.gold}`,
          boxShadow: '-4px 0 16px rgba(0,0,0,0.4)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: `2px solid ${COLORS.gold}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ color: COLORS.gold, margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Watch AI Assistant
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.gold,
              cursor: 'pointer',
              fontSize: '24px',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: msg.role === 'user' ? COLORS.gold : COLORS.messageBg,
                  color: msg.role === 'user' ? COLORS.dark : COLORS.lightBg,
                  wordWrap: 'break-word',
                  fontSize: '14px',
                  lineHeight: '1.4',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: COLORS.messageBg,
                  color: COLORS.gold,
                  fontSize: '14px',
                }}
              >
                Analyzing data...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '16px',
            borderTop: `1px solid ${COLORS.darkBorder}`,
            display: 'flex',
            gap: '8px',
          }}
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about inventory, pricing, market trends..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: `1px solid ${COLORS.darkBorder}`,
              backgroundColor: COLORS.dark,
              color: COLORS.lightBg,
              fontSize: '14px',
              resize: 'none',
              maxHeight: '100px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            style={{
              padding: '10px 16px',
              backgroundColor: COLORS.gold,
              color: COLORS.dark,
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#A67D47')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = COLORS.gold)}
          >
            Send
          </button>
        </div>
      </div>

      {/* Overlay when panel is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 998,
          }}
        />
      )}
    </>
  );
};

export default AIAgent;
