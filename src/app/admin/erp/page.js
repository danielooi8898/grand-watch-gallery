'use client'

import ERPSystem from '@/components/ERPSystem'

export default function ERPPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>ERP & CRM System</h1>
        <p style={{ color: '#666', margin: 0 }}>Manage inventory, stock movements, pricing, suppliers, customers, and sales pipeline</p>
      </div>

      <ERPSystem />
    </div>
  )
}
