'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, X, Save, Search } from 'lucide-react'
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
  const [activeSubTab, setActiveSubTab] = useState('inventory')
  const [editingItem, setEditingItem] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCondition, setFilterCondition] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterOwner, setFilterOwner] = useState('ALL')

  // Inventory with state
  const [inventoryItems, setInventoryItems] = useState(INVENTORY_DATA)

  // Extract unique customers from inventory owners
  const customers = useMemo(() => {
    const uniqueOwners = new Set()
    INVENTORY_DATA.forEach(item => {
      if (item.owner && item.owner.trim()) {
        uniqueOwners.add(item.owner)
      }
    })
    return Array.from(uniqueOwners).sort()
  }, [])

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = !searchTerm ||
        item.refId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNo.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCondition = filterCondition === 'ALL' || item.condition === filterCondition
      const matchesType = filterType === 'ALL' || item.type === filterType
      const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus
      const matchesOwner = filterOwner === 'ALL' || item.owner === filterOwner

      return matchesSearch && matchesCondition && matchesType && matchesStatus && matchesOwner
    })
  }, [inventoryItems, searchTerm, filterCondition, filterType, filterStatus, filterOwner])

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
          alert(`✅ Successfully imported ${newItems.length} items. Total: ${unique.length}`)
          setShowImportModal(false)
        }
      } catch (error) {
        alert('❌ Error importing CSV: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  // Save Inventory Item
  const handleSaveInventory = () => {
    if (!editingItem.refId || !editingItem.serialNo) {
      alert('❌ Ref ID and Serial No are required')
      return
    }
    if (editingId) {
      setInventoryItems(inventoryItems.map(item => item.id === editingId ? { ...editingItem, id: editingItem.refId } : item))
      alert('✅ Item updated successfully')
    }
    setEditingId(null)
    setEditingItem(null)
  }

  // Delete Inventory Item
  const handleDeleteInventory = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventoryItems(inventoryItems.filter(item => item.id !== id))
      alert('✅ Item deleted successfully')
    }
  }

  // Add New Inventory Item
  const handleAddInventory = () => {
    const newItem = {
      id: editingItem.refId,
      refId: editingItem.refId,
      brand: editingItem.brand,
      model: editingItem.model,
      serialNo: editingItem.serialNo,
      condition: editingItem.condition,
      year: editingItem.year,
      owner: editingItem.owner,
      costPrice: editingItem.costPrice,
      salePrice: editingItem.salePrice,
      commission: editingItem.commission,
      actorFee: editingItem.actorFee,
      ownerContact: editingItem.ownerContact,
      status: editingItem.status,
      type: editingItem.type,
    }

    const exists = inventoryItems.some(item => item.refId === newItem.refId)
    if (exists) {
      alert('❌ Item with this Ref ID already exists')
      return
    }

    setInventoryItems([...inventoryItems, newItem])
    alert('✅ Item added successfully')
    setShowAddModal(false)
    setEditingItem(null)
  }

  const EditInventoryModal = () => !editingItem || editingItem.type === 'customer' ? null : (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div style={{ background: COLORS.white, borderRadius: '8px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, background: COLORS.lightBg, padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.darkText }}>Edit Inventory Item</h3>
          <button onClick={() => { setEditingId(null); setEditingItem(null); setShowAddModal(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.lightText, padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {['refId', 'brand', 'model', 'serialNo', 'condition', 'year', 'costPrice', 'salePrice', 'commission', 'actorFee', 'owner', 'ownerContact', 'status', 'type'].map(field => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem', textTransform: 'capitalize' }}>{field === 'refId' ? 'Ref ID' : field === 'serialNo' ? 'Serial No' : field === 'ownerContact' ? 'Owner Contact' : field}</label>
              {field === 'condition' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
                  <option>NEW</option>
                  <option>USED</option>
                </select>
              ) : field === 'type' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
                  <option>Personal</option>
                  <option>Consignment</option>
                </select>
              ) : field === 'status' ? (
                <select value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
                  <option>Active</option>
                  <option>Sold</option>
                </select>
              ) : ['costPrice', 'salePrice', 'commission', 'actorFee'].includes(field) ? (
                <input type="number" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: parseFloat(e.target.value) || 0})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
              ) : (
                <input type="text" value={editingItem[field]} onChange={e => setEditingItem({...editingItem, [field]: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ position: 'sticky', bottom: 0, background: COLORS.lightBg, padding: '1.5rem', borderTop: `1px solid ${COLORS.darkBorder}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => { setEditingId(null); setEditingItem(null); setShowAddModal(false) }} style={{ padding: '0.5rem 1rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', background: COLORS.white, color: COLORS.darkText, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Cancel</button>
          <button onClick={editingId ? handleSaveInventory : handleAddInventory} style={{ padding: '0.5rem 1rem', background: COLORS.gold, color: COLORS.white, borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            {editingId ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )

  const renderInventoryTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Inventory Management</h3>
        <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>Showing {filteredInventory.length} of {inventoryItems.length} items</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setEditingItem({ refId: '', brand: '', model: '', serialNo: '', condition: 'NEW', year: '', costPrice: 0, salePrice: 0, commission: 0, actorFee: 0, owner: '', ownerContact: '', status: 'Active', type: 'Personal' }); setShowAddModal(true) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Item
        </button>
        <button onClick={() => setShowImportModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          📥 Import CSV
        </button>
      </div>

      {/* Search & Filters */}
      <div style={{ background: COLORS.white, padding: '1.5rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: COLORS.lightBg, padding: '0.5rem 0.75rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
          <Search size={16} color={COLORS.lightText} />
          <input type="text" placeholder="Search by Ref ID, Brand, Model, Serial No..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '0.875rem', color: COLORS.darkText }} />
          {searchTerm && <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.lightText }}>✕</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Condition</label>
            <select value={filterCondition} onChange={e => setFilterCondition(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option value="ALL">All</option>
              <option value="NEW">NEW</option>
              <option value="USED">USED</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Type</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option value="ALL">All</option>
              <option value="Personal">Personal</option>
              <option value="Consignment">Consignment</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option value="ALL">All</option>
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: COLORS.darkText, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Owner</label>
            <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option value="ALL">All Owners</option>
              {customers.map(owner => <option key={owner} value={owner}>{owner}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Ref ID</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Brand/Model</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Serial No</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Condition</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Year</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Cost</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Sale</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Owner</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Type</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ padding: '2rem', textAlign: 'center', color: COLORS.lightText }}>No items match your filters</td>
              </tr>
            ) : filteredInventory.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: COLORS.gold }}>{item.refId}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}><strong>{item.brand}</strong> {item.model}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{item.serialNo}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: item.condition === 'NEW' ? '#ecfdf5' : '#fef3c7', color: item.condition === 'NEW' ? '#047857' : '#b45309' }}>
                    {item.condition}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', color: COLORS.lightText, fontSize: '0.8rem' }}>{item.year}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.lightText, fontSize: '0.8rem' }}>{item.costPrice > 0 ? `MYR ${item.costPrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText, fontWeight: 600, fontSize: '0.8rem' }}>{item.salePrice > 0 ? `MYR ${item.salePrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 500, fontSize: '0.8rem' }}>{item.owner || '—'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: item.type === 'Consignment' ? '#fef3c7' : '#dbeafe', color: item.type === 'Consignment' ? '#b45309' : '#1e40af' }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: item.status === 'Active' ? '#ecfdf5' : '#fee2e2', color: item.status === 'Active' ? '#047857' : '#dc2626' }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => { setEditingItem(item); setEditingId(item.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteInventory(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }} title="Delete">
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

  const renderStockMovementsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Stock Movements</h3>
        <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>Track inventory in/out</p>
      </div>
      <div style={{ background: COLORS.white, padding: '2rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}`, textAlign: 'center', color: COLORS.lightText }}>
        <p>Stock movement records will appear here as you add/remove items from inventory</p>
      </div>
    </div>
  )

  const renderCustomersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Customer/Owner List</h3>
        <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>Extracted from inventory owners</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ background: COLORS.white, padding: '1.25rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
          <p style={{ fontSize: '0.75rem', color: COLORS.lightText, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Total Owners</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.gold }}>{customers.length}</p>
        </div>
        <div style={{ background: COLORS.white, padding: '1.25rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
          <p style={{ fontSize: '0.75rem', color: COLORS.lightText, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Personal Items</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.gold }}>{inventoryItems.filter(i => i.type === 'Personal').length}</p>
        </div>
        <div style={{ background: COLORS.white, padding: '1.25rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
          <p style={{ fontSize: '0.75rem', color: COLORS.lightText, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>Consignment Items</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.gold }}>{inventoryItems.filter(i => i.type === 'Consignment').length}</p>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Owner Name</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Total Items</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Personal</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Consignment</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Active Items</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((owner, idx) => {
              const ownerItems = inventoryItems.filter(i => i.owner === owner)
              const personalCount = ownerItems.filter(i => i.type === 'Personal').length
              const consignmentCount = ownerItems.filter(i => i.type === 'Consignment').length
              const activeCount = ownerItems.filter(i => i.status === 'Active').length
              return (
                <tr key={owner} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                  <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 500 }}>{owner}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.gold, fontWeight: 600 }}>{ownerItems.length}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText }}>{personalCount}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText }}>{consignmentCount}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText, fontWeight: 600 }}>{activeCount}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div style={{ background: COLORS.lightBg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '2rem', background: COLORS.dark, borderBottom: `1px solid ${COLORS.darkBorder}` }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.white, marginBottom: '0.5rem' }}>ERP & CRM System</h1>
        <p style={{ fontSize: '0.95rem', color: '#999', letterSpacing: '0.02em' }}>Manage inventory, stock movements, and customer data from CSV sources</p>
      </div>

      {/* Main Tabs */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.darkBorder}` }}>
        <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={() => { setActiveTab('erp'); setActiveSubTab('inventory') }} style={{ flex: 1, padding: '1rem', fontWeight: 600, fontSize: '0.95rem', borderBottom: activeTab === 'erp' ? `2px solid ${COLORS.gold}` : '2px solid transparent', color: activeTab === 'erp' ? COLORS.gold : COLORS.lightText, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            ERP System
          </button>
          <button onClick={() => { setActiveTab('crm'); setActiveSubTab('customers') }} style={{ flex: 1, padding: '1rem', fontWeight: 600, fontSize: '0.95rem', borderBottom: activeTab === 'crm' ? `2px solid ${COLORS.gold}` : '2px solid transparent', color: activeTab === 'crm' ? COLORS.gold : COLORS.lightText, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            CRM System
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ padding: '1rem', background: COLORS.lightBg, borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {activeTab === 'erp' && [
          { id: 'inventory', label: 'Inventory' },
          { id: 'movements', label: 'Stock Movements' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ padding: '0.5rem 1rem', background: activeSubTab === tab.id ? COLORS.gold : COLORS.white, color: activeSubTab === tab.id ? COLORS.white : COLORS.darkText, borderRadius: '4px', border: `1px solid ${activeSubTab === tab.id ? COLORS.gold : COLORS.darkBorder}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {tab.label}
          </button>
        ))}
        {activeTab === 'crm' && [
          { id: 'customers', label: 'Customers/Owners' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ padding: '0.5rem 1rem', background: activeSubTab === tab.id ? COLORS.gold : COLORS.white, color: activeSubTab === tab.id ? COLORS.white : COLORS.darkText, borderRadius: '4px', border: `1px solid ${activeSubTab === tab.id ? COLORS.gold : COLORS.darkBorder}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'erp' && activeSubTab === 'inventory' && renderInventoryTab()}
        {activeTab === 'erp' && activeSubTab === 'movements' && renderStockMovementsTab()}
        {activeTab === 'crm' && activeSubTab === 'customers' && renderCustomersTab()}
      </div>

      {/* Modals */}
      <EditInventoryModal />

      {showImportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ background: COLORS.white, borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.darkText }}>Import Inventory from CSV</h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.lightText, padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>Upload a CSV file to import or update inventory items.</p>
              <div style={{ border: `2px dashed ${COLORS.darkBorder}`, borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
                <input type="file" accept=".csv" onChange={handleCSVImport} style={{ display: 'none' }} id="csv-upload" />
                <label htmlFor="csv-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2rem' }}>📁</div>
                  <p style={{ fontWeight: 600, color: COLORS.darkText }}>Click to upload CSV</p>
                  <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>or drag and drop</p>
                </label>
              </div>
            </div>
            <div style={{ padding: '1.5rem', borderTop: `1px solid ${COLORS.darkBorder}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowImportModal(false)} style={{ padding: '0.5rem 1rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', background: COLORS.white, color: COLORS.darkText, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ERPSystem
