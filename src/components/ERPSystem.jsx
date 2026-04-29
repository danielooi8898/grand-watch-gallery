'use client'

import React, { useState } from 'react'
import { ChevronDown, Plus, Edit2, Trash2, Eye, Filter, Download } from 'lucide-react'

const ERPSystem = () => {
  const [activeTab, setActiveTab] = useState('erp')
  const [activeSubTab, setActiveSubTab] = useState('inventory')
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({})

  // ============ INVENTORY DATA ============
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, brand: 'Rolex', model: 'Submariner', sku: 'ROL-SUB-001', stock: 2, type: 'Personal', costPrice: 45000, salePrice: 65000, status: 'Active', lastUpdated: '2024-04-25' },
    { id: 2, brand: 'Patek Philippe', model: 'Nautilus', sku: 'PAT-NUT-001', stock: 1, type: 'Consignment', costPrice: 0, salePrice: 85000, status: 'Active', lastUpdated: '2024-04-20' },
    { id: 3, brand: 'Audemars Piguet', model: 'Royal Oak', sku: 'AUD-ROY-001', stock: 0, type: 'Personal', costPrice: 50000, salePrice: 72000, status: 'Low Stock', lastUpdated: '2024-04-22' },
    { id: 4, brand: 'Omega', model: 'Speedmaster', sku: 'OME-SPE-001', stock: 3, type: 'Personal', costPrice: 30000, salePrice: 42000, status: 'Active', lastUpdated: '2024-04-24' },
    { id: 5, brand: 'Tudor', model: 'Black Bay', sku: 'TUD-BAY-001', stock: 4, type: 'Consignment', costPrice: 0, salePrice: 28000, status: 'Active', lastUpdated: '2024-04-25' },
  ])

  // ============ STOCK MOVEMENTS DATA ============
  const [stockMovements, setStockMovements] = useState([
    { id: 1, date: '2024-04-25', type: 'IN', sku: 'ROL-SUB-001', brand: 'Rolex', model: 'Submariner', qty: 1, reason: 'Purchase from supplier', inventoryType: 'Personal', supplier: 'Dubai Luxury', reference: 'PO-2024-001', notes: 'Condition: New' },
    { id: 2, date: '2024-04-24', type: 'OUT', sku: 'OME-SPE-001', brand: 'Omega', model: 'Speedmaster', qty: 1, reason: 'Sold to customer', inventoryType: 'Personal', customer: 'Ahmad Khan', reference: 'INV-2024-045', notes: 'Customer: Ahmad Khan' },
    { id: 3, date: '2024-04-22', type: 'OUT', sku: 'AUD-ROY-001', brand: 'Audemars Piguet', model: 'Royal Oak', qty: 1, reason: 'Sold to customer', inventoryType: 'Personal', customer: 'Michael Chen', reference: 'INV-2024-044', notes: 'Wholesale order' },
    { id: 4, date: '2024-04-20', type: 'IN', sku: 'PAT-NUT-001', brand: 'Patek Philippe', model: 'Nautilus', qty: 1, reason: 'Consignment received', inventoryType: 'Consignment', supplier: 'Swiss Timepieces', reference: 'CONS-2024-001', notes: 'Consignment terms: 30 days' },
    { id: 5, date: '2024-04-18', type: 'IN', sku: 'TUD-BAY-001', brand: 'Tudor', model: 'Black Bay', qty: 4, reason: 'Consignment received', inventoryType: 'Consignment', supplier: 'Hong Kong Traders', reference: 'CONS-2024-002', notes: '' },
  ])

  // ============ CUSTOMER DATA (CRM) ============
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ahmad Khan', email: 'ahmad.khan@email.com', phone: '+6012-3456789', type: 'Retail', city: 'Kuala Lumpur', totalPurchases: 3, totalSpent: 150000, lastPurchase: '2024-04-24', status: 'Active' },
    { id: 2, name: 'Sarah Lee', email: 'sarah.lee@email.com', phone: '+6013-9876543', type: 'Retail', city: 'Selangor', totalPurchases: 2, totalSpent: 85000, lastPurchase: '2024-04-15', status: 'Active' },
    { id: 3, name: 'Michael Chen', email: 'michael.chen@email.com', phone: '+6011-5555555', type: 'Wholesale', city: 'Penang', totalPurchases: 12, totalSpent: 450000, lastPurchase: '2024-04-22', status: 'Active' },
    { id: 4, name: 'Fatima Aziz', email: 'fatima.aziz@email.com', phone: '+6016-7777777', type: 'Retail', city: 'Johor', totalPurchases: 1, totalSpent: 62000, lastPurchase: '2024-03-10', status: 'Inactive' },
  ])

  // ============ ORDERS DATA ============
  const [orders, setOrders] = useState([
    { id: 'ORD-2024-001', date: '2024-04-25', customer: 'Ahmad Khan', items: 1, amount: 42000, status: 'Completed', paymentStatus: 'Paid' },
    { id: 'ORD-2024-002', date: '2024-04-22', customer: 'Michael Chen', items: 2, amount: 120000, status: 'Completed', paymentStatus: 'Paid' },
    { id: 'ORD-2024-003', date: '2024-04-10', customer: 'Sarah Lee', items: 1, amount: 65000, status: 'Completed', paymentStatus: 'Paid' },
  ])

  // ============ SUPPLIERS DATA ============
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Dubai Luxury Watches', country: 'UAE', contact: '+971-4-123-4567', email: 'info@dubailuxury.ae', status: 'Active', products: 15, totalOrders: 8 },
    { id: 2, name: 'Swiss Timepieces Ltd', country: 'Switzerland', contact: '+41-44-555-5555', email: 'sales@swisswatches.ch', status: 'Active', products: 22, totalOrders: 12 },
    { id: 3, name: 'Hong Kong Traders', country: 'Hong Kong', contact: '+852-2888-8888', email: 'contact@hktraders.hk', status: 'Active', products: 8, totalOrders: 5 },
  ])

  // ============ SALES PIPELINE DATA ============
  const [salesPipeline, setSalesPipeline] = useState([
    { id: 1, stage: 'Lead', customer: 'James Wilson', value: 150000, brand: 'Rolex', daysInStage: 5, probability: '20%' },
    { id: 2, stage: 'Prospect', customer: 'Lisa Wong', value: 85000, brand: 'Omega', daysInStage: 8, probability: '50%' },
    { id: 3, stage: 'Quote', customer: 'David Smith', value: 250000, brand: 'Patek Philippe', daysInStage: 3, probability: '75%' },
    { id: 4, stage: 'Negotiation', customer: 'Emma Johnson', value: 180000, brand: 'Audemars Piguet', daysInStage: 12, probability: '90%' },
  ])

  // ============ RENDER FUNCTIONS ============

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Inventory Management</h3>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Brand/Model</th>
              <th className="text-left px-4 py-3 font-semibold">SKU</th>
              <th className="text-center px-4 py-3 font-semibold">Stock</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-right px-4 py-3 font-semibold">Cost Price</th>
              <th className="text-right px-4 py-3 font-semibold">Sale Price</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3"><strong>{item.brand}</strong> {item.model}</td>
                <td className="px-4 py-3 text-gray-600">{item.sku}</td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: item.stock === 0 ? '#dc2626' : '#333' }}>
                  {item.stock}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${item.type === 'Consignment' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{item.costPrice > 0 ? `MYR ${item.costPrice.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-right font-semibold">MYR {item.salePrice.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderStockMovementsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Stock Movements</h3>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={16} /> Record Movement
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Total In (This Month)</p>
          <p className="text-2xl font-bold">6 units</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Total Out (This Month)</p>
          <p className="text-2xl font-bold">3 units</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Personal Inventory</p>
          <p className="text-2xl font-bold">10 units</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Consignment</p>
          <p className="text-2xl font-bold">6 units</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-center px-4 py-3 font-semibold">Type</th>
              <th className="text-left px-4 py-3 font-semibold">Brand/Model</th>
              <th className="text-center px-4 py-3 font-semibold">Qty</th>
              <th className="text-left px-4 py-3 font-semibold">Inventory Type</th>
              <th className="text-left px-4 py-3 font-semibold">Reason</th>
              <th className="text-left px-4 py-3 font-semibold">Reference</th>
              <th className="text-left px-4 py-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map(movement => (
              <tr key={movement.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{movement.date}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${movement.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {movement.type}
                  </span>
                </td>
                <td className="px-4 py-3"><strong>{movement.brand}</strong> {movement.model}</td>
                <td className="px-4 py-3 text-center font-semibold">{movement.qty}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${movement.inventoryType === 'Consignment' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {movement.inventoryType}
                  </span>
                </td>
                <td className="px-4 py-3">{movement.reason}</td>
                <td className="px-4 py-3 text-gray-600">{movement.reference}</td>
                <td className="px-4 py-3 text-gray-600">{movement.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPricingTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Pricing Management</h3>
      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Brand</th>
              <th className="text-right px-4 py-3 font-semibold">Avg Cost Price</th>
              <th className="text-right px-4 py-3 font-semibold">Avg Sale Price</th>
              <th className="text-right px-4 py-3 font-semibold">Margin %</th>
              <th className="text-center px-4 py-3 font-semibold">Products</th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { brand: 'Rolex', cost: 45000, sale: 65000, margin: 44.4, products: 2 },
              { brand: 'Patek Philippe', cost: 0, sale: 85000, margin: 0, products: 1 },
              { brand: 'Audemars Piguet', cost: 50000, sale: 72000, margin: 44, products: 1 },
              { brand: 'Omega', cost: 30000, sale: 42000, margin: 40, products: 1 },
              { brand: 'Tudor', cost: 0, sale: 28000, margin: 0, products: 1 },
            ].map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{item.brand}</td>
                <td className="px-4 py-3 text-right">{item.cost > 0 ? `MYR ${item.cost.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-right font-semibold">MYR {item.sale.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-green-600 font-semibold">{item.margin > 0 ? `${item.margin.toFixed(1)}%` : '—'}</td>
                <td className="px-4 py-3 text-center">{item.products}</td>
                <td className="px-4 py-3 text-center"><button className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSuppliersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Suppliers</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white border rounded p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold">{supplier.name}</h4>
                <p className="text-sm text-gray-600">{supplier.country}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {supplier.status}
              </span>
            </div>
            <div className="space-y-2 text-sm border-t pt-3">
              <p><span className="text-gray-600">Phone:</span> {supplier.contact}</p>
              <p><span className="text-gray-600">Email:</span> {supplier.email}</p>
              <p><span className="text-gray-600">Products:</span> {supplier.products}</p>
              <p><span className="text-gray-600">Total Orders:</span> {supplier.totalOrders}</p>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center gap-1">
                <Edit2 size={14} /> Edit
              </button>
              <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center gap-1">
                <Eye size={14} /> View Orders
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCustomersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customer Database</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Total Customers</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold">MYR 747,000</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-2xl font-bold">MYR 62,250</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Active Today</p>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-center px-4 py-3 font-semibold">Purchases</th>
              <th className="text-right px-4 py-3 font-semibold">Total Spent</th>
              <th className="text-left px-4 py-3 font-semibold">Last Purchase</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${customer.type === 'Wholesale' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {customer.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{customer.totalPurchases}</td>
                <td className="px-4 py-3 text-right font-semibold">MYR {customer.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{customer.lastPurchase}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center"><button className="text-blue-600 hover:text-blue-800"><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSalesPipelineTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Sales Pipeline</h3>

      <div className="grid grid-cols-5 gap-4">
        {['Lead', 'Prospect', 'Quote', 'Negotiation', 'Won'].map(stage => (
          <div key={stage} className="bg-gray-50 rounded border p-3">
            <h4 className="font-semibold mb-3">{stage}</h4>
            <div className="space-y-2">
              {salesPipeline.filter(d => d.stage === stage).map(deal => (
                <div key={deal.id} className="bg-white p-2 rounded border text-xs">
                  <p className="font-semibold">{deal.customer}</p>
                  <p className="text-gray-600">{deal.brand}</p>
                  <p className="font-bold text-green-600">MYR {deal.value.toLocaleString()}</p>
                  <p className="text-gray-500">{deal.probability}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded border p-4">
        <h4 className="font-semibold mb-3">All Deals</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Brand</th>
                <th className="text-right px-4 py-3 font-semibold">Deal Value</th>
                <th className="text-left px-4 py-3 font-semibold">Stage</th>
                <th className="text-right px-4 py-3 font-semibold">Probability</th>
                <th className="text-right px-4 py-3 font-semibold">Days in Stage</th>
              </tr>
            </thead>
            <tbody>
              {salesPipeline.map(deal => (
                <tr key={deal.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{deal.customer}</td>
                  <td className="px-4 py-3">{deal.brand}</td>
                  <td className="px-4 py-3 text-right font-semibold">MYR {deal.value.toLocaleString()}</td>
                  <td className="px-4 py-3">{deal.stage}</td>
                  <td className="px-4 py-3 text-right">{deal.probability}</td>
                  <td className="px-4 py-3 text-right">{deal.daysInStage} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Orders</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold">MYR 227,000</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-2xl font-bold">MYR 75,667</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-gray-600 text-sm">Conversion Rate</p>
          <p className="text-2xl font-bold">15%</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Order ID</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Customer</th>
              <th className="text-center px-4 py-3 font-semibold">Items</th>
              <th className="text-right px-4 py-3 font-semibold">Amount</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Payment</th>
              <th className="text-center px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{order.id}</td>
                <td className="px-4 py-3 text-gray-600">{order.date}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3 text-center">{order.items}</td>
                <td className="px-4 py-3 text-right font-semibold">MYR {order.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Completed</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Paid</span>
                </td>
                <td className="px-4 py-3 text-center"><button className="text-blue-600 hover:text-blue-800"><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Main Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => { setActiveTab('erp'); setActiveSubTab('inventory') }}
          className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'erp' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
        >
          ERP System
        </button>
        <button
          onClick={() => { setActiveTab('crm'); setActiveSubTab('customers') }}
          className={`px-6 py-4 font-semibold border-b-2 transition ${activeTab === 'crm' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
        >
          CRM System
        </button>
      </div>

      <div className="p-6">
        {/* ERP Sub Tabs */}
        {activeTab === 'erp' && (
          <>
            <div className="flex gap-2 mb-6 border-b pb-4">
              {[
                { id: 'inventory', label: 'Inventory' },
                { id: 'movements', label: 'Stock Movements' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'suppliers', label: 'Suppliers' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-2 font-semibold text-sm rounded transition ${activeSubTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSubTab === 'inventory' && renderInventoryTab()}
            {activeSubTab === 'movements' && renderStockMovementsTab()}
            {activeSubTab === 'pricing' && renderPricingTab()}
            {activeSubTab === 'suppliers' && renderSuppliersTab()}
          </>
        )}

        {/* CRM Sub Tabs */}
        {activeTab === 'crm' && (
          <>
            <div className="flex gap-2 mb-6 border-b pb-4">
              {[
                { id: 'customers', label: 'Customers' },
                { id: 'pipeline', label: 'Sales Pipeline' },
                { id: 'orders', label: 'Orders' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-2 font-semibold text-sm rounded transition ${activeSubTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSubTab === 'customers' && renderCustomersTab()}
            {activeSubTab === 'pipeline' && renderSalesPipelineTab()}
            {activeSubTab === 'orders' && renderOrdersTab()}
          </>
        )}
      </div>
    </div>
  )
}

export default ERPSystem
