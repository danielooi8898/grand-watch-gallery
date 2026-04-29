'use client'

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import { INVENTORY_DATA } from '@/data/inventoryData'

// Admin portal theme
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
          alert(`Successfully imported ${newItems.length} items. Total: ${unique.length}`)
          setShowImportModal(false)
        }
      } catch (error) {
        alert('Error importing CSV: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

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
  ])

  const handleSaveInventory = () => {
    if (editingId) {
      setInventoryItems(inventoryItems.map(item => item.id === editingId ? editingItem : item))
    }
    setEditingId(null)
    setEditingItem(null)
  }

  const handleDeleteInventory = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id))
  }

  const handleSaveCustomer = () => {
    if (editingId) {
      setCustomers(customers.map(item => item.id === editingId ? editingItem : item))
    }
    setEditingId(null)
    setEditingItem(null)
  }

  const EditInventoryModal = () => !editingItem || editingItem.type === 'customer' ? null : (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div style={{ background: COLORS.white, borderRadius: '8px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, background: COLORS.lightBg, padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.darkText }}>Edit Inventory Item</h3>
          <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.lightText, padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Ref ID</label>
            <input type="text" value={editingItem.refId} onChange={e => setEditingItem({...editingItem, refId: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Brand</label>
            <input type="text" value={editingItem.brand} onChange={e => setEditingItem({...editingItem, brand: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Model</label>
            <input type="text" value={editingItem.model} onChange={e => setEditingItem({...editingItem, model: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Serial No</label>
            <input type="text" value={editingItem.serialNo} onChange={e => setEditingItem({...editingItem, serialNo: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Condition</label>
            <select value={editingItem.condition} onChange={e => setEditingItem({...editingItem, condition: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option>NEW</option>
              <option>USED</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Year</label>
            <input type="text" value={editingItem.year} onChange={e => setEditingItem({...editingItem, year: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Cost Price</label>
            <input type="number" value={editingItem.costPrice} onChange={e => setEditingItem({...editingItem, costPrice: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Sale Price</label>
            <input type="number" value={editingItem.salePrice} onChange={e => setEditingItem({...editingItem, salePrice: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Commission</label>
            <input type="number" value={editingItem.commission} onChange={e => setEditingItem({...editingItem, commission: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Actor Fee</label>
            <input type="number" value={editingItem.actorFee} onChange={e => setEditingItem({...editingItem, actorFee: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Type</label>
            <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option>Personal</option>
              <option>Consignment</option>
            </select>
          </div>
        </div>
        <div style={{ position: 'sticky', bottom: 0, background: COLORS.lightBg, padding: '1.5rem', borderTop: `1px solid ${COLORS.darkBorder}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', background: COLORS.white, color: COLORS.darkText, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSaveInventory} style={{ padding: '0.5rem 1rem', background: COLORS.gold, color: COLORS.white, borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  )

  const EditCustomerModal = () => !editingItem || editingItem.type === 'customer' ? null : (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div style={{ background: COLORS.white, borderRadius: '8px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, background: COLORS.lightBg, padding: '1.5rem', borderBottom: `1px solid ${COLORS.darkBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: COLORS.darkText }}>Edit Customer</h3>
          <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.lightText, padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Name</label>
            <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Email</label>
            <input type="email" value={editingItem.email} onChange={e => setEditingItem({...editingItem, email: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Phone</label>
            <input type="tel" value={editingItem.phone} onChange={e => setEditingItem({...editingItem, phone: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>City</label>
            <input type="text" value={editingItem.city} onChange={e => setEditingItem({...editingItem, city: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Type</label>
            <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }}>
              <option>Retail</option>
              <option>Wholesale</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: COLORS.darkText, marginBottom: '0.5rem' }}>Commission %</label>
            <input type="number" value={editingItem.commission} onChange={e => setEditingItem({...editingItem, commission: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.5rem 0.75rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>
        <div style={{ position: 'sticky', bottom: 0, background: COLORS.lightBg, padding: '1.5rem', borderTop: `1px solid ${COLORS.darkBorder}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', border: `1px solid ${COLORS.darkBorder}`, borderRadius: '4px', background: COLORS.white, color: COLORS.darkText, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSaveCustomer} style={{ padding: '0.5rem 1rem', background: COLORS.gold, color: COLORS.white, borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  )

  const renderInventoryTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Inventory Management</h3>
        <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>{inventoryItems.length} items total</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => setShowImportModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          📥 Import CSV
        </button>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}`, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Ref ID</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Brand/Model</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Serial No</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Condition</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Cost Price</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Sale Price</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Type</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: COLORS.gold }}>{item.refId}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}><strong>{item.brand}</strong> {item.model}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText }}>{item.serialNo}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: item.condition === 'NEW' ? '#ecfdf5' : '#fef3c7', color: item.condition === 'NEW' ? '#047857' : '#b45309' }}>
                    {item.condition}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.lightText }}>{item.costPrice > 0 ? `MYR ${item.costPrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText, fontWeight: 600 }}>{item.salePrice > 0 ? `MYR ${item.salePrice.toLocaleString()}` : '—'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: item.type === 'Consignment' ? '#fef3c7' : '#dbeafe', color: item.type === 'Consignment' ? '#b45309' : '#1e40af' }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => { setEditingItem(item); setEditingId(item.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteInventory(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
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
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Stock Movements</h3>
      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Date</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Type</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Brand/Model</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Qty</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Reason</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map((mov, idx) => (
              <tr key={mov.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{mov.date}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: mov.type === 'IN' ? '#ecfdf5' : '#fee2e2', color: mov.type === 'IN' ? '#047857' : '#dc2626' }}>
                    {mov.type}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{mov.brand} {mov.model}</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: COLORS.darkText, fontWeight: 600 }}>{mov.qty}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText }}>{mov.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCustomersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Customer Database</h3>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: COLORS.gold, color: COLORS.white, padding: '0.625rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Total Revenue', value: `MYR ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}` },
          { label: 'Avg Spent', value: `MYR ${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}` },
          { label: 'Active', value: customers.filter(c => c.status === 'Active').length },
        ].map((stat, idx) => (
          <div key={idx} style={{ background: COLORS.white, padding: '1.25rem', borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
            <p style={{ fontSize: '0.75rem', color: COLORS.lightText, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.5rem' }}>{stat.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: COLORS.gold }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Email</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Phone</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>City</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Total Spent</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={customer.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 500 }}>{customer.name}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{customer.email}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText }}>{customer.phone}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{customer.city}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText, fontWeight: 600 }}>MYR {customer.totalSpent.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#047857' }}>
                    {customer.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button onClick={() => { setEditingItem({...customer, type: 'customer'}); setEditingId(customer.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
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

  const renderSuppliersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Suppliers</h3>
      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Company</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Country</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Contact</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Email</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, idx) => (
              <tr key={supplier.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.darkText, fontWeight: 500 }}>{supplier.name}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{supplier.country}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText }}>{supplier.contact}</td>
                <td style={{ padding: '1rem', color: COLORS.lightText, fontSize: '0.8rem' }}>{supplier.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#047857' }}>
                    {supplier.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.gold, padding: '0.25rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
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

  const renderOrdersTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: COLORS.darkText }}>Orders</h3>
      <div style={{ overflowX: 'auto', background: COLORS.white, borderRadius: '4px', border: `1px solid ${COLORS.darkBorder}` }}>
        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: COLORS.lightBg }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Date</th>
              <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Customer</th>
              <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Amount</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Status</th>
              <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 600, color: COLORS.darkText }}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} style={{ borderBottom: `1px solid ${COLORS.darkBorder}`, background: idx % 2 === 0 ? COLORS.white : '#fafaf8' }}>
                <td style={{ padding: '1rem', color: COLORS.gold, fontWeight: 600 }}>{order.id}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{order.date}</td>
                <td style={{ padding: '1rem', color: COLORS.darkText }}>{order.customer}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: COLORS.darkText, fontWeight: 600 }}>MYR {order.amount.toLocaleString()}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#047857' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: '#ecfdf5', color: '#047857' }}>
                    {order.paymentStatus}
                  </span>
                </td>
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
      <div style={{ padding: '2rem', background: COLORS.dark, borderBottom: `1px solid ${COLORS.darkBorder}` }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.white, marginBottom: '0.5rem' }}>ERP & CRM System</h1>
        <p style={{ fontSize: '0.95rem', color: '#999', letterSpacing: '0.02em' }}>Manage inventory, stock movements, pricing, suppliers, customers, and sales pipeline</p>
      </div>

      {/* Tabs */}
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
          { id: 'customers', label: 'Customers' },
          { id: 'suppliers', label: 'Suppliers' },
          { id: 'orders', label: 'Orders' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ padding: '0.5rem 1rem', background: activeSubTab === tab.id ? COLORS.gold : COLORS.white, color: activeSubTab === tab.id ? COLORS.white : COLORS.darkText, borderRadius: '4px', border: `1px solid ${activeSubTab === tab.id ? COLORS.gold : COLORS.darkBorder}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'erp' && activeSubTab === 'inventory' && renderInventoryTab()}
        {activeTab === 'erp' && activeSubTab === 'movements' && renderStockMovementsTab()}
        {activeTab === 'crm' && activeSubTab === 'customers' && renderCustomersTab()}
        {activeTab === 'crm' && activeSubTab === 'suppliers' && renderSuppliersTab()}
        {activeTab === 'crm' && activeSubTab === 'orders' && renderOrdersTab()}
      </div>

      {/* Modals */}
      <EditInventoryModal />
      <EditCustomerModal />

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
              <p style={{ fontSize: '0.875rem', color: COLORS.lightText }}>Upload a CSV file to import inventory items. Supported formats:</p>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', fontSize: '0.875rem', color: COLORS.lightText, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Rolex - NEW</li>
                <li>ROLEX - HAVE STOCK</li>
                <li>Branded Watch - NEW</li>
                <li>Branded Watch - HAVE STOCK</li>
              </ul>
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
