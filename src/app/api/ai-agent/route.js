import { INVENTORY_DATA } from '@/data/inventoryData';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Analyze inventory to provide context to Claude
function analyzeInventory() {
  const activeItems = INVENTORY_DATA.filter(item => item.status === 'Active');
  const soldItems = INVENTORY_DATA.filter(item => item.status === 'Sold');
  const consignmentItems = INVENTORY_DATA.filter(item => item.type === 'Consignment');
  const personalItems = INVENTORY_DATA.filter(item => item.type === 'Personal');

  const brands = {};
  const models = {};
  const conditions = {};
  let totalInventoryValue = 0;
  let totalCost = 0;
  let activeValue = 0;

  INVENTORY_DATA.forEach(item => {
    brands[item.brand] = (brands[item.brand] || 0) + 1;
    models[item.model] = (models[item.model] || 0) + 1;
    conditions[item.condition] = (conditions[item.condition] || 0) + 1;
    totalInventoryValue += item.salePrice || 0;
    totalCost += item.costPrice || 0;
    if (item.status === 'Active') {
      activeValue += item.salePrice || 0;
    }
  });

  const topBrands = Object.entries(brands)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([brand, count]) => `${brand} (${count} items)`);

  const topModels = Object.entries(models)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([model, count]) => `${model} (${count} items)`);

  return {
    totalItems: INVENTORY_DATA.length,
    activeItems: activeItems.length,
    soldItems: soldItems.length,
    consignmentItems: consignmentItems.length,
    personalItems: personalItems.length,
    brands,
    topBrands,
    topModels,
    conditions,
    totalInventoryValue: totalInventoryValue.toLocaleString(),
    totalCost: totalCost.toLocaleString(),
    activeValue: activeValue.toLocaleString(),
    profitMargin: (totalInventoryValue - totalCost).toLocaleString(),
    profitMarginPercent: totalCost > 0 ? ((totalInventoryValue - totalCost) / totalCost * 100).toFixed(1) : 0,
  };
}

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const inventoryContext = analyzeInventory();

    const systemPrompt = `You are an expert AI assistant for Grand Watch Gallery, a luxury watch retail business. You have access to real-time inventory and business data.

CURRENT BUSINESS DATA:
- Total Watches in Inventory: ${inventoryContext.totalItems}
- Active (For Sale): ${inventoryContext.activeItems} watches
- Sold: ${inventoryContext.soldItems} watches
- Consignment Items: ${inventoryContext.consignmentItems}
- Personal Inventory: ${inventoryContext.personalItems}

INVENTORY VALUE:
- Total Inventory Value: $${inventoryContext.totalInventoryValue}
- Total Cost: $${inventoryContext.totalCost}
- Active Inventory Value: $${inventoryContext.activeValue}
- Estimated Profit Margin: $${inventoryContext.profitMargin} (${inventoryContext.profitMarginPercent}%)

TOP BRANDS:
${inventoryContext.topBrands.join(', ')}

TOP MODELS:
${inventoryContext.topModels.join(', ')}

INVENTORY CONDITIONS:
- New: ${inventoryContext.conditions.NEW || 0}
- Used: ${inventoryContext.conditions.USED || 0}

Your role is to:
1. Answer questions about current inventory levels, stock status, and availability
2. Provide pricing and revenue insights based on real data
3. Analyze market trends for luxury watches (especially Rolex)
4. Discuss competitive positioning and opportunities
5. Give business recommendations based on inventory analysis
6. Help identify patterns and opportunities for growth

When answering:
- Be specific with numbers from the actual inventory data
- Provide actionable insights and recommendations
- Maintain a professional but friendly tone
- Ask clarifying questions if needed
- Consider both short-term and long-term business implications`;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('AI Agent Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process query' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
