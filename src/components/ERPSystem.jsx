'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Save, ChevronRight } from 'lucide-react'
import { INVENTORY_DATA } from '@/data/inventoryData'

const ERPSystem = () => {
  const [activeTab, setActiveTab] = useState('erp')
  const [activeSubTab, setActiveSubTab] = useState('inventory')
  const [editingItem, setEditingItem] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)

  // CSV Import Handler
  const handleCSVImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csv = event.target?.result
        const lines = csv.toString().split('\n')
        const newItems = []

        lines.forEach((line, idx) => {
          if (idx < 3 || !line.trim()) return // Skip headers and empty lines

          const cols = line.split(',').map(c => c.trim())
          if (cols.length < 4) return

          // Parse based on CSV structure
          const refId = cols[1] || `R-${Date.now()}-${idx}`
          const brand = cols[3] || 'UNKNOWN'
          const model = cols[4] || ''
          const serialNo = cols[5] || ''
          const condition = cols[6]?.toUpperCase() || 'NEW'
          const year = cols[7] || ''
          const costPrice = parseFloat(cols[8]?.replace(/[^0-9.]/g, '') || 0) || 0
          const commission = parseFloat(cols[9]?.replace(/[^0-9.]/g, '') || 0) || 0
          const actorFee = parseFloat(cols[10]?.replace(/[^0-9.]/g, '') || 0) || 0
          const salePrice = parseFloat(cols[11]?.replace(/[^0-9.]/g, '') || 0) || 0
          const owner = cols[2] || ''
          const ownerContact = cols[12] || ''

          if (refId && brand && serialNo) {
            newItems.push({
              id: refId,
              refId,
              brand,
              model,
              serialNo,
              condition,
              year,
              owner,
              costPrice,
              salePrice,
              commission,
              actorFee,
              ownerContact,
              status: 'Active',
              type: (owner?.toUpperCase().includes('CONSIGN') || !owner) ? 'Consignment' : 'Personal'
            })
          }
        })

        if (newItems.length > 0) {
          const combined = [...inventoryItems, ...newItems]
          const unique = combined.filter((item, idx, arr) => arr.findIndex(i => i.refId === item.refId) === idx)
          setInventoryItems(unique)
          alert(`Successfully imported ${newItems.length} items. Total: ${unique.length}`)
          setShowImportModal(false)
        }
      } catch (error) {
        alert('Error importing CSV: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  // ============ INVENTORY DATA ============
  const [inventoryItems, setInventoryItems] = useState(INVENTORY_DATA)

  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ahmad Khan', email: 'ahmad.khan@email.com', phone: '+6012-3456789', type: 'Retail', city: 'Kuala Lumpur', commission: 0, totalSpent: 150000, status: 'Active' },
    { id: 2, name: 'Sarah Lee', email: 'sarah.lee@email.com', phone: '+6013-9876543', type: 'Retail', city: 'Selangor', commission: 0, totalSpent: 85000, status: 'Active' },
  ])

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Dubai Luxury Watches', country: 'UAE', contact: '+971-4-123-4567', email: 'info@dubailuxury.ae', status: 'Active' },
    { id: 2, name: 'Swiss Timepieces Ltd', country: 'Switzerland', contact: '+41-44-555-5555', email: 'sales@swisswatches.ch', status: 'Active' },
  ])

  const [orders, setOrders] = useState([
    { id: 'ORD-2024-001', date: '2024-04-25', customer: 'Ahmad Khan', items: 1, amount: 42000, commission: 0, commissionAmount: 0, actorFee: 0, status: 'Completed', paymentStatus: 'Paid' },
    { id: 'ORD-2024-002', date: '2024-04-22', customer: 'Michael Chen', items: 2, amount: 120000, commission: 5, commissionAmount: 6000, actorFee: 0, status: 'Completed', paymentStatus: 'Paid' },
  ])

  const [stockMovements, setStockMovements] = useState([
    { id: 1, date: '2024-04-25', type: 'IN', brand: 'Rolex', model: 'Submariner', qty: 1, reason: 'Purchase from supplier', inventoryType: 'Personal', reference: 'PO-2024-001' },
    { id: 2, date: '2024-04-24', type: 'OUT', brand: 'Omega', model: 'Speedmaster', qty: 1, reason: 'Sold to customer', inventoryType: 'Personal', reference: 'INV-2024-045' },
  ])

  // ============ EDIT HANDLERS ============
  const handleEditInventory = (item) => {
    setEditingId(item.id)
    setEditingItem({ ...item })
  }

  const handleSaveInventory = () => {
    setInventoryItems(inventoryItems.map(item => item.id === editingId ? editingItem : item))
    setEditingId(null)
    setEditingItem(null)
  }

  const handleDeleteInventory = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id))
  }

  const handleEditCustomer = (customer) => {
    setEditingId(customer.id)
    setEditingItem({ ...customer })
  }

  const handleSaveCustomer = () => {
    setCustomers(customers.map(c => c.id === editingId ? editingItem : c))
    setEditingId(null)
    setEditingItem(null)
  }

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id))
  }

  // ============ MODALS ============
  const EditInventoryModal = () => !editingItem || editingItem.type !== 'inventory' ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Edit Inventory Item</h3>
          <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ref ID</label>
            <input type="text" value={editingItem.refId} onChange={e => setEditingItem({...editingItem, refId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input type="text" value={editingItem.brand} onChange={e => setEditingItem({...editingItem, brand: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input type="text" value={editingItem.model} onChange={e => setEditingItem({...editingItem, model: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial No</label>
            <input type="text" value={editingItem.serialNo} onChange={e => setEditingItem({...editingItem, serialNo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
            <input type="number" value={editingItem.costPrice} onChange={e => setEditingItem({...editingItem, costPrice: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
            <input type="number" value={editingItem.salePrice} onChange={e => setEditingItem({...editingItem, salePrice: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission</label>
            <input type="number" value={editingItem.commission} onChange={e => setEditingItem({...editingItem, commission: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actor Fee</label>
            <input type="number" value={editingItem.actorFee} onChange={e => setEditingItem({...editingItem, actorFee: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Personal</option>
              <option>Consignment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select value={editingItem.condition} onChange={e => setEditingItem({...editingItem, condition: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>NEW</option>
              <option>USED</option>
            </select>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
          <button onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveInventory} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  const EditCustomerModal = () => !editingItem || editingItem.type !== 'customer' ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Edit Customer</h3>
          <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={editingItem.email} onChange={e => setEditingItem({...editingItem, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={editingItem.phone} onChange={e => setEditingItem({...editingItem, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" value={editingItem.city} onChange={e => setEditingItem({...editingItem, city: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Retail</option>
              <option>Wholesale</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission %</label>
            <input type="number" value={editingItem.commission} onChange={e => setEditingItem({...editingItem, commission: parseFloat(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
          <button onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveCustomer} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  // ============ RENDER FUNCTIONS ============
  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Inventory Management</h3>
          <p className="text-sm text-gray-600 mt-1">{inventoryItems.length} items</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button onClick={() => setShowImportModal(true)} className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
            📥 Import CSV
          </button>
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Ref ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Brand/Model</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Serial No</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Condition</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-900">Cost Price</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-900">Sale Price</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Type</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-blue-600">{item.refId}</td>
                <td className="px-4 py-3"><strong>{item.brand}</strong> {item.model}</td>
                <td className="px-4 py-3 text-gray-600">{item.serialNo}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item.condition === 'NEW' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{item.costPrice > 0 ? `MYR ${item.costPrice.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{item.salePrice > 0 ? `MYR ${item.salePrice.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${item.type === 'Consignment' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button onClick={() => handleEditInventory(item)} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteInventory(item.id)} className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCustomersTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Customer Database</h3>
          <p className="text-sm text-gray-600 mt-1">{customers.length} customers</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">MYR {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Avg Spent</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">MYR {Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{customers.filter(c => c.status === 'Active').length}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Type</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-900">Total Spent</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900">{customer.name}</td>
                <td className="px-4 py-3 text-gray-600">{customer.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${customer.type === 'Wholesale' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {customer.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">MYR {customer.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button onClick={() => { setEditingItem({...customer, type: 'customer'}); setEditingId(customer.id); }} className="text-blue-600 hover:text-blue-800 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteCustomer(customer.id)} className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderSuppliersTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Suppliers</h3>
          <p className="text-sm text-gray-600 mt-1">{suppliers.length} suppliers</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={18} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                <p className="text-sm text-gray-600">{supplier.country}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {supplier.status}
              </span>
            </div>
            <div className="space-y-2 text-sm border-t pt-4">
              <p><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-900">{supplier.contact}</span></p>
              <p><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900">{supplier.email}</span></p>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">Edit</button>
              <button className="flex-1 text-red-600 hover:text-red-800 text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Orders</h3>
          <p className="text-sm text-gray-600 mt-1">{orders.length} orders</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={18} /> New Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">MYR {orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Total Commission</p>
          <p className="text-3xl font-bold text-green-600 mt-2">MYR {orders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">MYR {Math.round(orders.reduce((sum, o) => sum + o.amount, 0) / orders.length).toLocaleString()}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Order ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Customer</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-900">Amount</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-900">Commission</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-blue-600">{order.id}</td>
                <td className="px-4 py-3 text-gray-600">{order.date}</td>
                <td className="px-4 py-3 text-gray-900">{order.customer}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">MYR {order.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">{order.commissionAmount > 0 ? `MYR ${order.commissionAmount.toLocaleString()}` : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors"><Edit2 size={16} /></button>
                  <button className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={16} /></button>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Stock Movements</h3>
          <p className="text-sm text-gray-600 mt-1">{stockMovements.length} movements</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={18} /> Record Movement
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Date</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Brand/Model</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Qty</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Reason</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-900">Type</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map(movement => (
              <tr key={movement.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-600">{movement.date}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${movement.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {movement.type}
                  </span>
                </td>
                <td className="px-4 py-3"><strong>{movement.brand}</strong> {movement.model}</td>
                <td className="px-4 py-3 text-center font-semibold text-gray-900">{movement.qty}</td>
                <td className="px-4 py-3 text-gray-600">{movement.reason}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${movement.inventoryType === 'Consignment' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {movement.inventoryType}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex gap-2 justify-center">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors"><Edit2 size={16} /></button>
                  <button className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Main Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setActiveTab('erp'); setActiveSubTab('inventory') }}
          className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition ${activeTab === 'erp' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
        >
          ERP System
        </button>
        <button
          onClick={() => { setActiveTab('crm'); setActiveSubTab('customers') }}
          className={`flex-1 px-6 py-4 font-semibold text-center border-b-2 transition ${activeTab === 'crm' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
        >
          CRM System
        </button>
      </div>

      <div className="p-4 md:p-6">
        {/* ERP Sub Tabs */}
        {activeTab === 'erp' && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-4 border-b">
              {[
                { id: 'inventory', label: 'Inventory' },
                { id: 'movements', label: 'Stock Movements' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-2 font-semibold text-sm rounded-lg whitespace-nowrap transition ${activeSubTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSubTab === 'inventory' && renderInventoryTab()}
            {activeSubTab === 'movements' && renderStockMovementsTab()}
          </>
        )}

        {/* CRM Sub Tabs */}
        {activeTab === 'crm' && (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-4 border-b">
              {[
                { id: 'customers', label: 'Customers' },
                { id: 'suppliers', label: 'Suppliers' },
                { id: 'orders', label: 'Orders' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-4 py-2 font-semibold text-sm rounded-lg whitespace-nowrap transition ${activeSubTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSubTab === 'customers' && renderCustomersTab()}
            {activeSubTab === 'suppliers' && renderSuppliersTab()}
            {activeSubTab === 'orders' && renderOrdersTab()}
          </>
        )}
      </div>

      {/* Modals */}
      <EditInventoryModal />
      <EditCustomerModal />

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Import Inventory from CSV</h3>
              <button onClick={() => setShowImportModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600">Upload a CSV file to import inventory items. Supported formats:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Rolex - NEW</li>
                <li>ROLEX - HAVE STOCK</li>
                <li>Branded Watch - NEW</li>
                <li>Branded Watch - HAVE STOCK</li>
              </ul>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="font-medium text-gray-900">Click to upload CSV</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </label>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ERPSystem
