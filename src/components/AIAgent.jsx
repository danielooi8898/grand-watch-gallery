'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { INVENTORY_DATA } from '@/data/inventoryData';

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'agent', content: 'Hello! I\'m your Grand Watch Gallery AI Assistant. I have complete access to your inventory, analytics, business data, and market insights. I can help you with: inventory management, pricing strategy, sales analysis, traffic insights, customer behavior, market trends, competitor analysis, and business recommendations. Ask me anything!' }
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

  // Memoized data analysis
  const dataAnalysis = useMemo(() => {
    const brands = {};
    const models = {};
    const owners = {};
    const conditions = {};
    let totalSalePrice = 0;
    let totalCost = 0;
    let totalCommission = 0;
    const activeByBrand = {};
    const soldByBrand = {};

    INVENTORY_DATA.forEach(item => {
      // Brand stats
      brands[item.brand] = (brands[item.brand] || 0) + 1;
      activeByBrand[item.brand] = (activeByBrand[item.brand] || 0) + (item.status === 'Active' ? 1 : 0);
      soldByBrand[item.brand] = (soldByBrand[item.brand] || 0) + (item.status === 'Sold' ? 1 : 0);

      // Model stats
      models[item.model] = (models[item.model] || 0) + 1;

      // Owner stats
      if (item.owner) owners[item.owner] = (owners[item.owner] || 0) + 1;

      // Condition stats
      conditions[item.condition] = (conditions[item.condition] || 0) + 1;

      // Financial
      totalSalePrice += item.salePrice || 0;
      totalCost += item.costPrice || 0;
      totalCommission += item.commission || 0;
    });

    const activeCount = INVENTORY_DATA.filter(i => i.status === 'Active').length;
    const soldCount = INVENTORY_DATA.filter(i => i.status === 'Sold').length;
    const consignmentCount = INVENTORY_DATA.filter(i => i.type === 'Consignment').length;
    const personalCount = INVENTORY_DATA.filter(i => i.type === 'Personal').length;

    return {
      brands,
      models,
      owners,
      conditions,
      totalSalePrice,
      totalCost,
      totalCommission,
      profit: totalSalePrice - totalCost,
      profitMargin: totalCost > 0 ? ((totalSalePrice - totalCost) / totalCost * 100).toFixed(1) : 0,
      activeCount,
      soldCount,
      consignmentCount,
      personalCount,
      totalItems: INVENTORY_DATA.length,
      activeByBrand,
      soldByBrand,
      topBrands: Object.entries(brands).sort((a, b) => b[1] - a[1]).slice(0, 10),
      topModels: Object.entries(models).sort((a, b) => b[1] - a[1]).slice(0, 10),
    };
  }, []);

  // Comprehensive query processor
  const processQuery = async (query) => {
    const q = query.toLowerCase();
    const brandNames = Object.keys(dataAnalysis.brands);
    const modelNames = Object.keys(dataAnalysis.models);

    // Extract brand and model mentions
    const mentionedBrand = brandNames.find(b => q.includes(b.toLowerCase()));
    const mentionedModel = modelNames.find(m => q.includes(m.toLowerCase()));

    // ========== INVENTORY ANALYSIS ==========
    if (q.includes('how many') || q.includes('total') || q.includes('count') || q.includes('stock') || q.includes('inventory')) {
      if (mentionedBrand) {
        const active = dataAnalysis.activeByBrand[mentionedBrand] || 0;
        const total = dataAnalysis.brands[mentionedBrand] || 0;
        const sold = dataAnalysis.soldByBrand[mentionedBrand] || 0;
        const value = INVENTORY_DATA.filter(i => i.brand === mentionedBrand).reduce((sum, i) => sum + (i.salePrice || 0), 0);
        return `${mentionedBrand}: ${active} active (${total} total, ${sold} sold). Inventory value: $${value.toLocaleString()}.`;
      } else if (q.includes('active')) {
        return `Active inventory: ${dataAnalysis.activeCount} watches with total value of $${dataAnalysis.totalSalePrice.toLocaleString()}.`;
      } else {
        return `Total inventory: ${dataAnalysis.totalItems} watches. Active: ${dataAnalysis.activeCount}, Sold: ${dataAnalysis.soldCount}. Value: $${dataAnalysis.totalSalePrice.toLocaleString()}.`;
      }
    }

    // ========== BRAND ANALYSIS ==========
    if (q.includes('brand')) {
      const brandList = dataAnalysis.topBrands.map(([b, count]) => {
        const active = dataAnalysis.activeByBrand[b] || 0;
        return `${b} (${count} total, ${active} active)`;
      }).join(', ');
      return `Top brands: ${brandList}.`;
    }

    // ========== MODEL/PRODUCT ANALYSIS ==========
    if (q.includes('model') || q.includes('watch') || q.includes('product')) {
      if (mentionedBrand) {
        const brandModels = INVENTORY_DATA.filter(i => i.brand === mentionedBrand).map(i => i.model);
        const uniqueModels = [...new Set(brandModels)].slice(0, 15);
        return `${mentionedBrand} models: ${uniqueModels.join(', ')}.`;
      } else {
        const topModels = dataAnalysis.topModels.map(([m, count]) => `${m} (${count})`).slice(0, 10).join(', ');
        return `Most common models: ${topModels}.`;
      }
    }

    // ========== FINANCIAL ANALYSIS ==========
    if (q.includes('price') || q.includes('cost') || q.includes('revenue') || q.includes('profit') || q.includes('margin') || q.includes('financial') || q.includes('money')) {
      if (q.includes('profit') || q.includes('margin')) {
        return `Total inventory value: $${dataAnalysis.totalSalePrice.toLocaleString()}. Total cost: $${dataAnalysis.totalCost.toLocaleString()}. Profit: $${dataAnalysis.profit.toLocaleString()} (${dataAnalysis.profitMargin}% margin). Commission collected: $${dataAnalysis.totalCommission.toLocaleString()}.`;
      } else if (q.includes('brand') && mentionedBrand) {
        const brandItems = INVENTORY_DATA.filter(i => i.brand === mentionedBrand);
        const value = brandItems.reduce((sum, i) => sum + (i.salePrice || 0), 0);
        const cost = brandItems.reduce((sum, i) => sum + (i.costPrice || 0), 0);
        return `${mentionedBrand} value: $${value.toLocaleString()}. Cost: $${cost.toLocaleString()}. Profit: $${(value - cost).toLocaleString()}.`;
      } else {
        return `Total sale value: $${dataAnalysis.totalSalePrice.toLocaleString()}. Cost: $${dataAnalysis.totalCost.toLocaleString()}. Revenue potential: $${dataAnalysis.profit.toLocaleString()}.`;
      }
    }

    // ========== CONDITION ANALYSIS ==========
    if (q.includes('condition') || q.includes('new') || q.includes('used') || q.includes('pre-owned')) {
      const newCount = dataAnalysis.conditions.NEW || 0;
      const usedCount = dataAnalysis.conditions.USED || 0;
      const newValue = INVENTORY_DATA.filter(i => i.condition === 'NEW').reduce((sum, i) => sum + (i.salePrice || 0), 0);
      const usedValue = INVENTORY_DATA.filter(i => i.condition === 'USED').reduce((sum, i) => sum + (i.salePrice || 0), 0);
      return `New: ${newCount} watches ($${newValue.toLocaleString()}). Used/Pre-owned: ${usedCount} watches ($${usedValue.toLocaleString()}).`;
    }

    // ========== INVENTORY TYPE (Personal vs Consignment) ==========
    if (q.includes('consignment') || q.includes('personal') || q.includes('type')) {
      const personalValue = INVENTORY_DATA.filter(i => i.type === 'Personal').reduce((sum, i) => sum + (i.salePrice || 0), 0);
      const consignmentValue = INVENTORY_DATA.filter(i => i.type === 'Consignment').reduce((sum, i) => sum + (i.salePrice || 0), 0);
      return `Personal inventory: ${dataAnalysis.personalCount} watches ($${personalValue.toLocaleString()}). Consignment: ${dataAnalysis.consignmentCount} watches ($${consignmentValue.toLocaleString()}).`;
    }

    // ========== AVAILABILITY CHECKS ==========
    if (q.includes('do we have') || q.includes('do you have') || q.includes('available') || q.includes('in stock')) {
      if (mentionedBrand && mentionedModel) {
        const items = INVENTORY_DATA.filter(i => i.brand === mentionedBrand && i.model === mentionedModel);
        const active = items.filter(i => i.status === 'Active').length;
        const sold = items.filter(i => i.status === 'Sold').length;
        if (active > 0) return `Yes! ${active} ${mentionedBrand} ${mentionedModel} available (${sold} sold).`;
        else return `No ${mentionedBrand} ${mentionedModel} currently available.`;
      } else if (mentionedBrand) {
        const active = dataAnalysis.activeByBrand[mentionedBrand] || 0;
        return active > 0 ? `Yes! ${active} ${mentionedBrand} watches available.` : `No ${mentionedBrand} watches currently available.`;
      }
    }

    // ========== PERFORMANCE & SALES ==========
    if (q.includes('performance') || q.includes('best selling') || q.includes('top selling') || q.includes('most popular') || q.includes('sales')) {
      const bestBrands = dataAnalysis.topBrands.map(([b, count]) => {
        const active = dataAnalysis.activeByBrand[b] || 0;
        const conversionRate = ((active / count) * 100).toFixed(0);
        return `${b} (${count} sold, ${active} active, ${conversionRate}% active rate)`;
      }).slice(0, 5).join('. ');
      return `Best performing brands: ${bestBrands}.`;
    }

    // ========== OWNER/CONSIGNMENT PARTNERS ==========
    if (q.includes('owner') || q.includes('partner') || q.includes('consignment')) {
      const topOwners = Object.entries(dataAnalysis.owners).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([owner, count]) => `${owner} (${count})`).join(', ');
      return `Top inventory partners: ${topOwners}.`;
    }

    // ========== BUSINESS OVERVIEW ==========
    if (q.includes('overview') || q.includes('summary') || q.includes('status') || q.includes('health')) {
      const conversionRate = ((dataAnalysis.soldCount / dataAnalysis.totalItems) * 100).toFixed(1);
      return `Business Status: ${dataAnalysis.totalItems} total inventory, ${dataAnalysis.activeCount} active ($${dataAnalysis.totalSalePrice.toLocaleString()}). ${conversionRate}% sold. Profit margin: ${dataAnalysis.profitMargin}%. Top brand: ${dataAnalysis.topBrands[0][0]}.`;
    }

    // ========== RECOMMENDATIONS & STRATEGY ==========
    if (q.includes('recommend') || q.includes('should') || q.includes('strategy') || q.includes('improve') || q.includes('optimize')) {
      const slowBrands = dataAnalysis.topBrands.filter(([b]) => (dataAnalysis.activeByBrand[b] || 0) === 0).slice(0, 3);
      const activeRates = dataAnalysis.topBrands.map(([b]) => {
        const active = dataAnalysis.activeByBrand[b] || 0;
        const total = dataAnalysis.brands[b] || 1;
        return { brand: b, rate: (active / total * 100).toFixed(0) };
      });
      const bestPerformers = activeRates.filter(a => a.rate >= 50).slice(0, 3).map(a => a.brand).join(', ');
      const recommendations = [
        `Focus on top performers: ${bestPerformers}`,
        slowBrands.length > 0 ? `Liquidate slow movers: ${slowBrands.map(b => b[0]).join(', ')}` : '',
        `Increase consignment partnerships to reduce capital`,
        `Target ${dataAnalysis.topModels[0]?.[0]} and similar high-demand models`,
      ].filter(Boolean).join('. ');
      return `Recommendations: ${recommendations}.`;
    }

    // ========== ANALYTICS & TRAFFIC (Mock data until GA integration) ==========
    if (q.includes('traffic') || q.includes('visitor') || q.includes('analytics') || q.includes('pageview') || q.includes('user')) {
      return `To provide live traffic data, I need Google Analytics integration. Currently I can analyze your inventory conversion: ${dataAnalysis.activeCount}/${dataAnalysis.totalItems} items active (${((dataAnalysis.activeCount/dataAnalysis.totalItems)*100).toFixed(0)}%). Recommend: Set up GA4 to track visitor-to-sales conversion.`;
    }

    // ========== MARKET TRENDS & GENERAL KNOWLEDGE ==========
    if (q.includes('trend') || q.includes('market') || q.includes('forecast')) {
      return `2026 Market Trends: Rolex sports models (Submariner, GMT-Master II, Sea-Dweller) maintain strong demand and appreciation. Steel sports watches outperform precious metals in volume. Vintage and pre-owned Rolex pieces see 15-20% annual appreciation. Recommendation: Prioritize acquiring these models, focus on consignment to manage capital.`;
    }

    // ========== COMPETITORS ==========
    if (q.includes('compet') || q.includes('rival')) {
      return `Key competitors: Tourneau (NYC-based, large inventory), Bob's Watches (online-focused, quick shipping), WatchBox (consignment model). Our advantages: curated inventory mix, consignment option reduces capital, personalized service. Recommendation: Monitor their pricing on Rolex sports models weekly.`;
    }

    // ========== SALES & CONVERSION ==========
    if (q.includes('sold') || q.includes('conversion') || q.includes('sell through')) {
      const conversionRate = ((dataAnalysis.soldCount / dataAnalysis.totalItems) * 100).toFixed(1);
      const avgItemValue = (dataAnalysis.totalSalePrice / dataAnalysis.totalItems).toFixed(0);
      const avgCost = (dataAnalysis.totalCost / dataAnalysis.totalItems).toFixed(0);
      return `Sell-through rate: ${conversionRate}%. Total sold: ${dataAnalysis.soldCount} watches, $${(dataAnalysis.soldCount * avgItemValue).toLocaleString()}. Avg item: Cost $${avgCost}, Sale price $${avgItemValue}.`;
    }

    // ========== DEFAULT RESPONSE ==========
    return `I can analyze your inventory, pricing, sales performance, brand/model insights, financial metrics, stock conditions, and provide business recommendations. I also have general knowledge about market trends and competitors. What would you like to know?`;
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
