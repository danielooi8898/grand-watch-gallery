'use client';

import { useState, useRef, useEffect } from 'react';
import { INVENTORY_DATA } from '@/data/inventoryData';

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'agent', content: 'Hello! I\'m your Watch Gallery AI Assistant. I have access to your complete inventory database and can answer questions about stocks, pricing, brands, models, and more. Ask me anything about your watches!' }
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

  // Intelligent database query processor
  const processQuery = async (query) => {
    const q = query.toLowerCase();

    // Extract search terms
    const brands = [...new Set(INVENTORY_DATA.map(i => i.brand))];
    const models = [...new Set(INVENTORY_DATA.map(i => i.model))];

    // Find mentioned brand
    const mentionedBrand = brands.find(b => q.includes(b.toLowerCase()));
    const mentionedModel = models.find(m => q.includes(m.toLowerCase()));

    // INVENTORY LEVEL QUERIES
    if (q.includes('how many') || q.includes('total') || q.includes('count') || q.includes('stock')) {
      if (mentionedBrand) {
        const count = INVENTORY_DATA.filter(i => i.brand === mentionedBrand && i.status === 'Active').length;
        const total = INVENTORY_DATA.filter(i => i.brand === mentionedBrand).length;
        return `We have ${count} active ${mentionedBrand} watches in stock out of ${total} total.`;
      } else if (q.includes('active')) {
        const activeCount = INVENTORY_DATA.filter(i => i.status === 'Active').length;
        const totalCount = INVENTORY_DATA.length;
        return `We currently have ${activeCount} active watches in stock out of ${totalCount} total watches in inventory.`;
      } else if (q.includes('sold')) {
        const soldCount = INVENTORY_DATA.filter(i => i.status === 'Sold').length;
        return `We have sold ${soldCount} watches.`;
      } else {
        const active = INVENTORY_DATA.filter(i => i.status === 'Active').length;
        const sold = INVENTORY_DATA.filter(i => i.status === 'Sold').length;
        return `Total inventory: ${INVENTORY_DATA.length} watches. Active: ${active}, Sold: ${sold}.`;
      }
    }

    // BRAND QUERIES
    if (q.includes('brand') || q.includes('which brand')) {
      const brandCounts = {};
      INVENTORY_DATA.forEach(item => {
        brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
      });
      const topBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([brand, count]) => `${brand} (${count})`);
      return `Our top brands are: ${topBrands.join(', ')}.`;
    }

    // MODEL QUERIES
    if (q.includes('model') && !q.includes('price')) {
      if (mentionedBrand) {
        const models = INVENTORY_DATA.filter(i => i.brand === mentionedBrand)
          .map(i => i.model);
        const uniqueModels = [...new Set(models)].slice(0, 10);
        return `${mentionedBrand} models we have: ${uniqueModels.join(', ')}.`;
      } else {
        const allModels = [...new Set(INVENTORY_DATA.map(i => i.model))].slice(0, 15);
        return `Some of our models include: ${allModels.join(', ')}.`;
      }
    }

    // PRICING QUERIES
    if (q.includes('price') || q.includes('cost') || q.includes('value')) {
      const totalSalePrice = INVENTORY_DATA.reduce((sum, i) => sum + (i.salePrice || 0), 0);
      const totalCost = INVENTORY_DATA.reduce((sum, i) => sum + (i.costPrice || 0), 0);
      const profit = totalSalePrice - totalCost;

      if (mentionedBrand) {
        const brandItems = INVENTORY_DATA.filter(i => i.brand === mentionedBrand);
        const brandValue = brandItems.reduce((sum, i) => sum + (i.salePrice || 0), 0);
        return `Total value of ${mentionedBrand} watches: $${brandValue.toLocaleString()}.`;
      } else if (q.includes('profit') || q.includes('margin')) {
        const margin = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : 0;
        return `Total inventory value: $${totalSalePrice.toLocaleString()}. Estimated profit: $${profit.toLocaleString()} (${margin}% margin).`;
      } else {
        return `Total inventory sale value: $${totalSalePrice.toLocaleString()}. Total cost: $${totalCost.toLocaleString()}.`;
      }
    }

    // CONDITION QUERIES
    if (q.includes('condition') || q.includes('new') || q.includes('used')) {
      const newCount = INVENTORY_DATA.filter(i => i.condition === 'NEW').length;
      const usedCount = INVENTORY_DATA.filter(i => i.condition === 'USED').length;
      return `We have ${newCount} new watches and ${usedCount} used/pre-owned watches.`;
    }

    // TYPE QUERIES (Personal vs Consignment)
    if (q.includes('consignment') || q.includes('personal') || q.includes('type')) {
      const consignment = INVENTORY_DATA.filter(i => i.type === 'Consignment').length;
      const personal = INVENTORY_DATA.filter(i => i.type === 'Personal').length;
      return `Personal inventory: ${personal} watches. Consignment: ${consignment} watches.`;
    }

    // SPECIFIC ITEM LOOKUP
    if (q.includes('do we have') || q.includes('do you have')) {
      if (mentionedBrand && mentionedModel) {
        const items = INVENTORY_DATA.filter(i => i.brand === mentionedBrand && i.model === mentionedModel);
        const active = items.filter(i => i.status === 'Active').length;
        return active > 0 ? `Yes! We have ${active} ${mentionedBrand} ${mentionedModel} available.` : `We don't have active ${mentionedBrand} ${mentionedModel} in stock currently.`;
      } else if (mentionedBrand) {
        const count = INVENTORY_DATA.filter(i => i.brand === mentionedBrand && i.status === 'Active').length;
        return count > 0 ? `Yes! We have ${count} active ${mentionedBrand} watches.` : `We don't have active ${mentionedBrand} watches currently.`;
      }
    }

    // MARKET/TREND GENERAL KNOWLEDGE
    if (q.includes('trend') || q.includes('market') || q.includes('popular')) {
      return `Based on current market trends, Rolex sports models (Submariner, GMT, Datejust) remain highly sought after. Steel sports watches outperform precious metals in volume. Vintage and pre-owned pieces are seeing increased collector interest. We should focus on acquiring popular models with strong demand.`;
    }

    // COMPETITOR GENERAL KNOWLEDGE
    if (q.includes('compet') || q.includes('competitor')) {
      return `Major competitors in luxury watches include Tourneau, Bob's Watches, and Chronostore. Our advantages: curated inventory mix of new and pre-owned, consignment model reduces capital requirements, personalized service. We should monitor competitor pricing on our top-selling models.`;
    }

    // DEFAULT RESPONSE
    return `I can help you with inventory levels, pricing analysis, brand and model information, stock conditions, and more. What would you like to know about our watches?`;
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
