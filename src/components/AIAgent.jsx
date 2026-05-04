'use client';

import { useState, useRef, useEffect } from 'react';
import { INVENTORY_DATA } from '@/data/inventoryData';

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'agent', content: 'Hello! I\'m your Watch Gallery AI Assistant. I can help you analyze inventory, check current market trends, understand competitor pricing, and answer questions about stocks and pricing. What would you like to know?' }
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

  // Analyze inventory data to generate insights
  const analyzeInventory = () => {
    const activeItems = INVENTORY_DATA.filter(item => item.status === 'Active');
    const soldItems = INVENTORY_DATA.filter(item => item.status === 'Sold');
    const consignmentItems = INVENTORY_DATA.filter(item => item.type === 'Consignment');
    const personalItems = INVENTORY_DATA.filter(item => item.type === 'Personal');

    const brands = {};
    const models = {};
    let totalInventoryValue = 0;
    let totalCost = 0;

    INVENTORY_DATA.forEach(item => {
      brands[item.brand] = (brands[item.brand] || 0) + 1;
      models[item.model] = (models[item.model] || 0) + 1;
      totalInventoryValue += item.salePrice || 0;
      totalCost += item.costPrice || 0;
    });

    return {
      totalItems: INVENTORY_DATA.length,
      activeItems: activeItems.length,
      soldItems: soldItems.length,
      consignmentItems: consignmentItems.length,
      personalItems: personalItems.length,
      brands,
      models,
      totalInventoryValue,
      totalCost,
      profitMargin: totalInventoryValue - totalCost,
    };
  };

  // Process user queries
  const processQuery = async (query) => {
    const lowerQuery = query.toLowerCase();
    const inventory = analyzeInventory();

    let response = '';

    // Stock and Inventory Questions
    if (lowerQuery.includes('stock') || lowerQuery.includes('inventory') || lowerQuery.includes('how many')) {
      if (lowerQuery.includes('rolex')) {
        const rolexCount = INVENTORY_DATA.filter(item => item.brand === 'ROLEX' && item.status === 'Active').length;
        response = `We currently have ${rolexCount} active Rolex watches in stock. The Rolex collection is one of our premium offerings with strong demand and good margins.`;
      } else if (lowerQuery.includes('active')) {
        response = `We have ${inventory.activeItems} active items in our inventory out of ${inventory.totalItems} total items. ${inventory.consignmentItems} are consignment pieces and ${inventory.personalItems} are personal inventory.`;
      } else {
        const topBrands = Object.entries(inventory.brands).sort((a, b) => b[1] - a[1]).slice(0, 3);
        response = `Current inventory: ${inventory.totalItems} total watches. Top brands: ${topBrands.map(b => `${b[0]} (${b[1]} items)`).join(', ')}. Active items: ${inventory.activeItems}, Sold: ${inventory.soldItems}.`;
      }
    }

    // Pricing Questions
    else if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('revenue')) {
      if (lowerQuery.includes('total')) {
        response = `Total inventory value: $${(inventory.totalInventoryValue || 0).toLocaleString()}. Total cost: $${(inventory.totalCost || 0).toLocaleString()}. Projected profit margin: $${(inventory.profitMargin || 0).toLocaleString()}.`;
      } else if (lowerQuery.includes('margin')) {
        const margin = inventory.totalCost > 0 ? ((inventory.profitMargin / inventory.totalCost) * 100).toFixed(1) : 0;
        response = `Your current profit margin is approximately ${margin}%. With ${inventory.activeItems} active items, there's good potential for revenue growth.`;
      } else {
        response = `Our pricing strategy focuses on maintaining healthy margins while staying competitive. Current total sale price value: $${(inventory.totalInventoryValue || 0).toLocaleString()}.`;
      }
    }

    // Lead and Traffic Questions
    else if (lowerQuery.includes('lead') || lowerQuery.includes('traffic') || lowerQuery.includes('visitor')) {
      response = `To get current traffic and lead data, I would need to integrate with your Google Analytics and CRM system. Based on your inventory level (${inventory.activeItems} active items), I'd recommend analyzing which watch brands and models are driving the most engagement to optimize your inventory mix.`;
    }

    // Market Trends
    else if (lowerQuery.includes('trend') || lowerQuery.includes('market') || lowerQuery.includes('popular')) {
      response = `Current watch market trends (2026): Rolex sports models remain highly sought after with strong appreciation. Vintage Rolex watches are seeing increased collector interest. Steel sports watches outperform precious metal pieces in volume. Recommendation: Focus on diversifying your active inventory with popular Rolex models like Submariner, GMT, and Datejust. Consider acquiring more pre-owned pieces as they have lower acquisition cost with comparable demand.`;
    }

    // Competitor Analysis
    else if (lowerQuery.includes('compet') || lowerQuery.includes('competitor')) {
      response = `Major competitors in the luxury watch space include Tourneau, Bob's Watches, and Chronostore. Our differentiation: ${inventory.totalItems} curated inventory items with mix of consignment and personal stock. Competitive advantages: Mix of new and pre-owned, consignment model reduces capital requirements. Recommend monitoring competitor pricing on top 5 models: ${Object.entries(inventory.models).sort((a, b) => b[1] - a[1]).slice(0, 5).map(m => m[0]).join(', ')}.`;
    }

    // General insights
    else if (lowerQuery.includes('insight') || lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      response = `Business Overview: You have ${inventory.totalItems} watches with ${inventory.activeItems} currently available. ${inventory.consignmentItems} consignment items reduce capital risk. Your top brand is ${Object.entries(inventory.brands).sort((a, b) => b[1] - a[1])[0][0]}. Estimated inventory value: $${(inventory.totalInventoryValue || 0).toLocaleString()}. Key opportunity: Increase active inventory turnover from consignment partners.`;
    }

    // Default response
    else {
      response = `I can help you with: inventory levels, pricing analysis, market trends, competitor insights, and stock movements. We have ${inventory.activeItems} active watches with total value of $${(inventory.totalInventoryValue || 0).toLocaleString()}. What specific aspect would you like to explore?`;
    }

    return response;
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
