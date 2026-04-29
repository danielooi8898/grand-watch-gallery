'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, X, Save, Search, BarChart3, ShoppingCart, Users, Package, Truck, TrendingUp } from 'lucide-react'
import { INVENTORY_DATA } from '@/data/inventoryData'

const COLORS = {
  gold: '#B08D57',
  dark: '#0A0A0A',
  darkBorder: '#1A1A1A',
  lightBg: '#F7F6F3',
  lightText: '#5C5C5C',
  darkText: '#0A0A0A',
  white: '#ffffff',
}

const ERPSystem = () => {
  const [activeTab, setActiveTab] = useState('erp')
  const [activeSubTab, setActiveSubTab] = useState('dashboard')
  const [editingItem, setEditingItem] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingType, setEditingType] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  // Search & Filter & Sort
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCondition, setFilterCondition] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterOwner, setFilterOwner] = useState('ALL')
  const [filterBrand, setFilterBrand] = useState('ALL')
  const [filterModel, setFilterModel] = useState('ALL')
  const [sortBy, setSortBy] = useState('refId')
  const [sortOrder, setSortOrder] = useState('asc')

  // Inventory from CSV
  const [inventory, setInventory] = useState(INVENTORY_DATA)

  // Customers - can be added/edited
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Ahmad Khan', email: 'ahmad@email.com', phone: '+6012-3456789', city: 'Kuala Lumpur', type: 'Retail', status: 'Active', totalSpent: 250000, notes: '' },
    { id: 2, name: 'Sarah Lee', email: 'sarah@email.com', phone: '+6013-9876543', city: 'Selangor', type: 'Retail', status: 'Active', totalSpent: 180000, notes: '' },
    { id: 3, name: 'Michael Chen', email: 'michael@email.com', phone: '+6014-5555555', city: 'Penang', type: 'Wholesale', status: 'Active', totalSpent: 520000, notes: '' },
  ])

  // Suppliers - can be added/edited
  const [suppliers, setSuppliers] = useState([
    { id: 1, company: 'Dubai Luxury Watches', country: 'UAE', contact: '+971-4-123-4567', email: 'info@dubailuxury.ae', category: 'Rolex', rating: 4.5, status: 'Active' },
    { id: 2, company: 'Swiss Timepieces Ltd', country: 'Switzerland', contact: '+41-44-555-5555', email: 'sales@swisswatches.ch', category: 'Luxury', rating: 4.8, status: 'Active' },
    { id: 3, company: 'Asia Watch Distributor', country: 'Singapore', contact: '+65-6789-0123', email: 'sales@asiawatch.sg', category: 'Branded', rating: 4.2, status: 'Active' },
  ])

  // Orders - track sales
  const [orders, setOrders] = useState([
    { id: 'ORD-001', date: '2024-04-25', customer: 'Ahmad Khan', items: 1, refIds: ['R-1579'], total: 45000, commission: 2250, status: 'Completed', payment: 'Paid' },
    { id: 'ORD-002', date: '2024-04-22', customer: 'Michael Chen', items: 2, refIds: ['R-1687', 'W-425'], total: 125000, commission: 6250, status: 'Completed', payment: 'Paid' },
    { id: 'ORD-003', date: '2024-04-20', customer: 'Sarah Lee', items: 1, refIds: ['R-1644'], total: 52000, commission: 0, status: 'Pending', payment: 'Pending' },
  ])

  // Stock Movements - track in/out
  const [movements, setMovements] = useState([
    { id: 1, date: '2024-04-25', type: 'OUT', refId: 'R-1579', brand: 'Rolex', qty: 1, reason: 'Sold to Ahmad Khan', user: 'Admin' },
    { id: 2, date: '2024-04-22', type: 'OUT', refId: 'R-1687', brand: 'Rolex', qty: 1, reason: 'Sold to Michael Chen', user: 'Admin' },
    { id: 3, date: '2024-04-20', type: 'IN', refId: 'W-200', brand: 'Patek Philippe', qty: 1, reason: 'Received from supplier', user: 'Admin' },
  ])

  // Get unique values from inventory
  const owners = useMemo(() => {
    const uniqueOwners = new Set()
    inventory.forEach(item => {
      if (item.owner && item.owner.trim()) uniqueOwners.add(item.owner)
    })
    return Array.from(uniqueOwners).sort()
  }, [inventory])

  const brands = useMemo(() => {
    const uniqueBrands = new Set()
    inventory.forEach(item => {
      if (item.brand && item.brand.trim()) uniqueBrands.add(item.brand)
    })
    return Array.from(uniqueBrands).sort()
  }, [inventory])

  const models = useMemo(() => {
    const uniqueModels = new Set()
    inventory.forEach(item => {
      if (item.model && item.model.trim()) uniqueModels.add(item.model)
    })
    return Array.from(uniqueModels).sort()
  }, [inventory])

  // Filtered & Sorted Inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventory.filter(item => {
      const matchesSearch = !searchTerm ||
        item.refId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCondition = filterCondition === 'ALL' || item.condition === filterCondition
      const matchesType = filterType === 'ALL' || item.type === filterType
      const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus
      const matchesOwner = filterOwner === 'ALL' || item.owner === filterOwner
      const matchesBrand = filterBrand === 'ALL' || item.brand === filterBrand
      const matchesModel = filterModel === 'ALL' || item.model === filterModel
      return matchesSearch && matchesCondition && matchesType && matchesStatus && matchesOwner && matchesBrand && matchesModel
    })

    // Sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      // Handle numeric comparisons
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }

      // Handle string comparisons
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
      const comparison = aVal.localeCompare(bVal)
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [inventory, searchTerm, filterCondition, filterType, filterStatus, filterOwner, filterBrand, filterModel, sortBy, sortOrder])

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeItems = inventory.filter(i => i.status === 'Active').length
    const totalValue = inventory.filter(i => i.status === 'Active').reduce((sum, i) => sum + i.salePrice, 0)
    const soldItems = inventory.filter(i => i.status === 'Sold').length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    return { activeItems, totalValue, soldItems, totalRevenue }
  }, [inventory, orders])

  // CSV Import
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
          if (idx < 3 || !line.trim()) return
          const cols = line.split(',').map(c => c.trim())
          if (cols.length < 4) return
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
            newItems.push({ id: refId, refId, brand, model, serialNo, condition, year, owner, costPrice, salePrice, commission, actorFee, ownerContact, status: 'Active', type: (owner?.toUpperCase().includes('CONSIGN') || !owner) ? 'Consignment' : 'Personal' })
          }
        })
        if (newItems.length > 0) {
          const combined = [...inventory, ...newItems]
          const unique = combined.filter((item, idx, arr) => arr.findIndex(i => i.refId === item.refId) === idx)
          setInventory(unique)
          alert(`✅ Imported ${newItems.length} items`)
          setShowImportModal(false)
        }
      } catch (error) {
        alert('❌ Error: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  // Save/Update functions
  const handleSave = () => {
    if (!editingItem) return
    if (editingType === 'inventory') {
      if (!editingItem.refId || !editingItem.serialNo) { alert('Ref ID and Serial No required'); return }
      if (editingId) {
        setInventory(inventory.map(i => i.id === editingId ? { ...editingItem, id: editingItem.refId } : i))
      } else {
        if (inventory.some(i => i.refId === editingItem.refId)) { alert('Item already exists'); return }
        setInventory([...inventory, { ...editingItem, id: editingItem.refId }])
      }
      alert('Saved')
    } else if (editingType === 'customer') {
      if (!editingItem.name || !editingItem.email) { alert('Name and Email required'); return }
      if (editingId) {
        setCustomers(customers.map(c => c.id === editingId ? editingItem : c))
      } else {
        setCustomers([...customers, { ...editingItem, id: Math.max(...customers.map(c => c.id), 0) + 1 }])
      }
      alert('Saved')
    } else if (editingType === 'supplier') {
      if (!editingItem.company || !editingItem.country) { alert('Company and Country required'); return }
      if (editingId) {
        setSuppliers(suppliers.map(s => s.id === editingId ? editingItem : s))
      } else {
        setSuppliers([...suppliers, { ...editingItem, id: Math.max(...suppliers.map(s => s.id), 0) + 1 }])
      }
      alert('Saved')
    } else if (editingType === 'order') {
      if (!editingItem.customer || !editingItem.total) { alert('Customer and Total required'); return }
      if (editingId) {
        setOrders(orders.map(o => o.id === editingId ? editingItem : o))
      } else {
        const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`
        setOrders([...orders, { ...editingItem, id: newId }])
      }
      alert('Saved')
    }
    setEditingItem(null)
    setEditingId(null)
    setEditingType(null)
    setShowModal(false)
  }

  const handleDelete = (type, id) => {
    if (!window.confirm('Delete this item?')) return
    if (type === 'inventory') setInventory(inventory.filter(i => i.id !== id))
    else if (type === 'customer') setCustomers(customers.filter(c => c.id !== id))
    else if (type === 'supplier') setSuppliers(suppliers.filter(s => s.id !== id))
    else if (type === 'order') setOrders(orders.filter(o => o.id !== id))
    alert('Deleted')
  }

  const handleMarkSold = (itemId) => {
    setInventory(inventory.map(item =>
      item.id === itemId ? { ...item, status: 'Sold' } : item
    ))
  }

  // Modal Component
  const Modal = () => !showModal ? null : (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div style={{ background: COLORS.white, borderRadius: '8px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, background: COLORS.lightBg, padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.darkText }}>
            {editingId ? 'Edit' : 'Add'} {editingType === 'inventory' ? 'Item' : editingType === 'customer' ? 'Customer' : editingType === 'supplier' ? 'Supplier' : 'Order'}
          </h3>
          <button onClick={() => { setShowModal(false); setEditingItem(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.darkText, padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {editingType === 'inventory' && ['refId', 'brand', 'model', 'serialNo', 'condition', 'year', 'costPrice', 'salePrice', 'commission', 'actorFee', 'owner', 'status', 'type', 'ownerContact'].map(field => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.4rem', textTransform: 'uppercase' }}>{field}</label>
              {['condition', 'type', 'status'].includes(field) ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  {field === 'condition' ? [<option key="new">NEW</option>, <option key="used">USED</option>] : field === 'type' ? [<option key="p">Personal</option>, <option key="c">Consignment</option>] : [<option key="a">Active</option>, <option key="s">Sold</option>]}
                </select>
              ) : ['costPrice', 'salePrice', 'commission', 'actorFee'].includes(field) ? (
                <input type="number" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              ) : (
                <input type="text" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              )}
            </div>
          ))}
          {editingType === 'customer' && ['name', 'email', 'phone', 'city', 'type', 'status', 'totalSpent', 'notes'].map(field => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.4rem', textTransform: 'uppercase' }}>{field}</label>
              {field === 'type' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  <option>Retail</option>
                  <option>Wholesale</option>
                </select>
              ) : field === 'status' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              ) : ['totalSpent'].includes(field) ? (
                <input type="number" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              ) : (
                <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              )}
            </div>
          ))}
          {editingType === 'supplier' && ['company', 'country', 'contact', 'email', 'category', 'rating', 'status'].map(field => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.4rem', textTransform: 'uppercase' }}>{field}</label>
              {field === 'status' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              ) : ['rating'].includes(field) ? (
                <input type="number" step="0.1" min="0" max="5" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              ) : (
                <input type={field === 'email' ? 'email' : 'text'} value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              )}
            </div>
          ))}
          {editingType === 'order' && ['customer', 'items', 'total', 'commission', 'status', 'payment', 'date'].map(field => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.4rem', textTransform: 'uppercase' }}>{field}</label>
              {field === 'status' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              ) : field === 'payment' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Partial</option>
                </select>
              ) : field === 'customer' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                  {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              ) : ['items', 'total', 'commission'].includes(field) ? (
                <input type="number" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: field === 'items' ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              ) : (
                <input type={field === 'date' ? 'date' : 'text'} value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ position: 'sticky', bottom: 0, background: COLORS.lightBg, padding: '1.5rem', borderTop: `1px solid ${COLORS.darkBorder}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => { setShowModal(false); setEditingItem(null) }} style={{ padding: '0.5rem 1.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', background: COLORS.white, color: COLORS.darkText, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '0.5rem 1.5rem', background: COLORS.gold, color: COLORS.white, borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Save</button>
        </div>
      </div>
    </div>
  )

  // Dashboard
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.darkText }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Active Items', value: kpis.activeItems, color: '#10b981' },
          { label: 'Inventory Value', value: `MYR ${kpis.totalValue.toLocaleString()}`, color: '#3b82f6' },
          { label: 'Total Sold', value: kpis.soldItems, color: '#8b5cf6' },
          { label: 'Total Revenue', value: `MYR ${kpis.totalRevenue.toLocaleString()}`, color: COLORS.gold },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: COLORS.white, padding: '1.5rem', borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}` }}>
            <p style={{ fontSize: '0.75rem', color: COLORS.lightText, textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.75rem' }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Recent Orders */}
        <div style={{ background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}`, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.darkText }}>Recent Orders</h3>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {orders.slice(0, 5).map((order, idx) => (
              <div key={idx} style={{ padding: '1rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, color: COLORS.darkText, marginBottom: '0.25rem' }}>{order.id}</p>
                  <p style={{ fontSize: '0.85rem', color: COLORS.lightText }}>{order.customer}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: COLORS.darkText }}>MYR {order.total.toLocaleString()}</p>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 600, background: order.status === 'Completed' ? '#ecfdf5' : '#fef3c7', color: order.status === 'Completed' ? '#047857' : '#b45309' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Summary */}
        <div style={{ background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}`, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.darkText }}>Stock Summary</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Total Items', value: inventory.length },
              { label: 'NEW Condition', value: inventory.filter(i => i.condition === 'NEW').length },
              { label: 'USED Condition', value: inventory.filter(i => i.condition === 'USED').length },
              { label: 'Personal', value: inventory.filter(i => i.type === 'Personal').length },
              { label: 'Consignment', value: inventory.filter(i => i.type === 'Consignment').length },
            ].map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx < 4 ? '1rem' : 0, borderBottom: idx < 4 ? `1px solid ${COLORS.darkBorder}` : 'none' }}>
                <span style={{ color: COLORS.darkText, fontWeight: 500 }}>{stat.label}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.gold }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Inventory Tab
  const renderInventory = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.darkText }}>Inventory Management</h2>
        <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>Showing {filteredInventory.length} of {inventory.length}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setEditingType('inventory'); setEditingItem({ refId: '', brand: '', model: '', serialNo: '', condition: 'NEW', year: '', costPrice: 0, salePrice: 0, commission: 0, actorFee: 0, owner: '', status: 'Active', type: 'Personal', ownerContact: '' }); setEditingId(null); setShowModal(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Item
        </button>
        <button onClick={() => setShowImportModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          Import CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ background: COLORS.white, padding: '1.5rem', borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: COLORS.lightBg, padding: '0.5rem 0.75rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
          <Search size={16} color={COLORS.lightText} />
          <input type="text" placeholder="Search by Ref ID, Brand, Model, Serial No..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', color: COLORS.darkText }} />
          {searchTerm && <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.lightText, padding: '0.25rem' }}><X size={18} /></button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Brand', value: filterBrand, onChange: setFilterBrand, options: ['ALL', ...brands] },
            { label: 'Model', value: filterModel, onChange: setFilterModel, options: ['ALL', ...models] },
            { label: 'Condition', value: filterCondition, onChange: setFilterCondition, options: ['ALL', 'NEW', 'USED'] },
            { label: 'Type', value: filterType, onChange: setFilterType, options: ['ALL', 'Personal', 'Consignment'] },
            { label: 'Status', value: filterStatus, onChange: setFilterStatus, options: ['ALL', 'Active', 'Sold'] },
            { label: 'Owner', value: filterOwner, onChange: setFilterOwner, options: ['ALL', ...owners] },
          ].map((filter, idx) => (
            <div key={idx}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{filter.label}</label>
              <select value={filter.value} onChange={e => filter.onChange(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem', color: COLORS.darkText }}>
                {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              {[
                { label: 'Ref ID', key: 'refId', align: 'left' },
                { label: 'Brand', key: 'brand', align: 'left' },
                { label: 'Model', key: 'model', align: 'left' },
                { label: 'Serial No', key: 'serialNo', align: 'left' },
                { label: 'Condition', key: 'condition', align: 'center' },
                { label: 'Cost', key: 'costPrice', align: 'right' },
                { label: 'Sale', key: 'salePrice', align: 'right' },
                { label: 'Owner', key: 'owner', align: 'left' },
                { label: 'Type', key: 'type', align: 'left' },
                { label: 'Status', key: 'status', align: 'left' },
              ].map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)} style={{ textAlign: col.align, padding: '1rem', fontWeight: 600, color: sortBy === col.key ? COLORS.gold : COLORS.darkText, cursor: 'pointer', userSelect: 'none', background: sortBy === col.key ? 'rgba(176,141,87,0.08)' : 'transparent', transition: 'all 0.2s' }}>
                  {col.label} {sortBy === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ padding: '2rem', textAlign: 'center', color: COLORS.lightText }}>No items found</td>
              </tr>
            ) : filteredInventory.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: COLORS.gold }}>{item.refId}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 500 }}>{item.brand}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{item.model}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{item.serialNo}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: item.condition === 'NEW' ? '#ecfdf5' : '#fef3c7', color: item.condition === 'NEW' ? '#047857' : '#b45309' }}>
                    {item.condition}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.lightText, fontSize: '0.8rem' }}>{item.costPrice > 0 ? `MYR ${item.costPrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText, fontWeight: 600, fontSize: '0.8rem' }}>{item.salePrice > 0 ? `MYR ${item.salePrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 500, fontSize: '0.85rem' }}>{item.owner || '—'}</td>
                <td style={{ padding: '1rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontWeight: 600, background: item.type === 'Personal' ? '#dbeafe' : '#fef3c7', color: item.type === 'Personal' ? '#1e40af' : '#b45309' }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontWeight: 600, background: item.status === 'Active' ? '#ecfdf5' : '#fee2e2', color: item.status === 'Active' ? '#047857' : '#dc2626' }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {item.status === 'Active' && (
                    <button onClick={() => handleMarkSold(item.id)} style={{ padding: '0.35rem 0.75rem', background: COLORS.gold, color: COLORS.white, border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>
                      Sold
                    </button>
                  )}
                  <button onClick={() => { setEditingType('inventory'); setEditingItem(item); setEditingId(item.id); setShowModal(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete('inventory', item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Customers Tab
  const renderCustomers = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.darkText }}>Customers</h2>
        <button onClick={() => { setEditingType('customer'); setEditingItem({ name: '', email: '', phone: '', city: '', type: 'Retail', status: 'Active', totalSpent: 0, notes: '' }); setEditingId(null); setShowModal(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Total Revenue', value: `MYR ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}` },
          { label: 'Avg Spend', value: `MYR ${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}` },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: COLORS.white, padding: '1rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
            <p style={{ fontSize: '0.75rem', color: COLORS.lightText, fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{stat.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.gold }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Email</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Phone</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>City</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Type</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Total Spent</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={customer.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 600 }}>{customer.name}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{customer.email}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText }}>{customer.phone}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{customer.city}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontSize: '0.85rem' }}>{customer.type}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.gold, fontWeight: 600 }}>MYR {customer.totalSpent.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#047857' }}>
                    {customer.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => { setEditingType('customer'); setEditingItem(customer); setEditingId(customer.id); setShowModal(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete('customer', customer.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Suppliers Tab
  const renderSuppliers = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.darkText }}>Suppliers</h2>
        <button onClick={() => { setEditingType('supplier'); setEditingItem({ company: '', country: '', contact: '', email: '', category: '', rating: 0, status: 'Active' }); setEditingId(null); setShowModal(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Company</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Country</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Contact</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Category</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Rating</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, idx) => (
              <tr key={supplier.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 600 }}>{supplier.company}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{supplier.country}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{supplier.contact}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{supplier.category}</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: COLORS.gold, fontWeight: 600 }}>{'⭐'.repeat(Math.floor(supplier.rating))} {supplier.rating}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#047857' }}>
                    {supplier.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => { setEditingType('supplier'); setEditingItem(supplier); setEditingId(supplier.id); setShowModal(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete('supplier', supplier.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Orders Tab
  const renderOrders = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.darkText }}>Orders</h2>
        <button onClick={() => { setEditingType('order'); setEditingItem({ customer: '', date: new Date().toISOString().split('T')[0], items: 0, total: 0, commission: 0, status: 'Pending', payment: 'Pending', refIds: [] }); setEditingId(null); setShowModal(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> New Order
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Revenue', value: `MYR ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}` },
          { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: COLORS.white, padding: '1rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
            <p style={{ fontSize: '0.75rem', color: COLORS.lightText, fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{stat.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.gold }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Date</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Customer</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Total</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Commission</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Payment</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.gold, fontWeight: 600 }}>{order.id}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{order.date}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{order.customer}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.gold, fontWeight: 600 }}>MYR {order.total.toLocaleString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText }}>{order.commission > 0 ? `MYR ${order.commission.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: order.status === 'Completed' ? '#ecfdf5' : '#fef3c7', color: order.status === 'Completed' ? '#047857' : '#b45309' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: order.payment === 'Paid' ? '#ecfdf5' : '#fee2e2', color: order.payment === 'Paid' ? '#047857' : '#dc2626' }}>
                    {order.payment}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => { setEditingType('order'); setEditingItem(order); setEditingId(order.id); setShowModal(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete('order', order.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  // Stock Movements
  const renderMovements = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.darkText }}>Stock Movements</h2>
      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '8px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Date</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Type</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Ref ID</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Brand</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Qty</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Reason</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>By</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((mov, idx) => (
              <tr key={mov.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{mov.date}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: mov.type === 'IN' ? '#ecfdf5' : '#fee2e2', color: mov.type === 'IN' ? '#047857' : '#dc2626' }}>
                    {mov.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: COLORS.gold, fontWeight: 600 }}>{mov.refId}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{mov.brand}</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: COLORS.darkText, fontWeight: 600 }}>{mov.qty}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{mov.reason}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{mov.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div style={{ background: COLORS.lightBg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '2rem 2rem', background: COLORS.dark, borderBottom: `3px solid ${COLORS.gold}` }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: COLORS.gold, margin: 0, letterSpacing: '0.5px' }}>ERP & CRM System</h1>
      </div>

      {/* Main Tabs */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', borderTop: `4px solid ${COLORS.gold}` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex' }}>
          {[
            { id: 'erp', label: 'ERP System' },
            { id: 'crm', label: 'CRM System' },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setActiveSubTab(tab.id === 'erp' ? 'dashboard' : 'customers') }} style={{ flex: 1, padding: '1.25rem', fontWeight: 700, fontSize: '1rem', borderBottom: activeTab === tab.id ? `3px solid ${COLORS.gold}` : '3px solid transparent', color: activeTab === tab.id ? COLORS.gold : COLORS.lightText, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '1rem 2rem', background: COLORS.lightBg, display: 'flex', gap: '1rem', flexWrap: 'wrap', borderBottom: `1px solid ${COLORS.darkBorder}` }}>
        {activeTab === 'erp' && [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'movements', label: 'Stock Movements', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: activeSubTab === tab.id ? COLORS.gold : COLORS.white, color: activeSubTab === tab.id ? COLORS.white : COLORS.darkText, borderRadius: '4px', border: `1px solid ${activeSubTab === tab.id ? COLORS.gold : COLORS.darkBorder}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}>
              <Icon size={16} /> {tab.label}
            </button>
          )
        })}
        {activeTab === 'crm' && [
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'suppliers', label: 'Suppliers', icon: Truck },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: activeSubTab === tab.id ? COLORS.gold : COLORS.white, color: activeSubTab === tab.id ? COLORS.white : COLORS.darkText, borderRadius: '4px', border: `1px solid ${activeSubTab === tab.id ? COLORS.gold : COLORS.darkBorder}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}>
              <Icon size={16} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '2rem' }}>
        {activeTab === 'erp' && activeSubTab === 'dashboard' && renderDashboard()}
        {activeTab === 'erp' && activeSubTab === 'inventory' && renderInventory()}
        {activeTab === 'erp' && activeSubTab === 'movements' && renderMovements()}
        {activeTab === 'crm' && activeSubTab === 'customers' && renderCustomers()}
        {activeTab === 'crm' && activeSubTab === 'suppliers' && renderSuppliers()}
        {activeTab === 'crm' && activeSubTab === 'orders' && renderOrders()}
      </div>

      {/* Modals */}
      <Modal />

      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: COLORS.white, borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.darkText }}>Import Inventory</h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.darkText, padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: `2px dashed ${COLORS.darkBorder}`, borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
                <input type="file" accept=".csv" onChange={handleCSVImport} style={{ display: 'none' }} id="csv-upload" />
                <label htmlFor="csv-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <p style={{ fontWeight: 700, color: COLORS.darkText }}>Click to upload CSV</p>
                  <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>or drag and drop</p>
                </label>
              </div>
            </div>
            <div style={{ padding: '1.5rem', borderTop: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowImportModal(false)} style={{ padding: '0.5rem 1.5rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', background: COLORS.white, color: COLORS.darkText, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ERPSystem
