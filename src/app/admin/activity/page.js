'use client'
import { useEffect, useState } from 'react'
import { getActivityLogs } from '@/lib/activityLogger'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

const CATEGORIES = [
  { value: null, label: 'All Categories' },
  { value: 'auth', label: 'Authentication' },
  { value: 'collection', label: 'Collection' },
  { value: 'blog', label: 'Journal' },
  { value: 'enquiries', label: 'Enquiries' },
  { value: 'leads', label: 'Leads' },
  { value: 'settings', label: 'Settings' },
  { value: 'content', label: 'Homepage' },
  { value: 'erp', label: 'ERP & CRM' },
  { value: 'traffic', label: 'Traffic' }
]

const ACTION_LABELS = {
  login: 'Login',
  logout: 'Logout',
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  view: 'Viewed',
  export: 'Exported',
  import: 'Imported',
  publish: 'Published',
  draft: 'Drafted',
  archive: 'Archived'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function ActionBadge({ action, category }) {
  const colors = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    create: 'bg-blue-100 text-blue-800',
    update: 'bg-yellow-100 text-yellow-800',
    delete: 'bg-red-100 text-red-800',
    view: 'bg-gray-100 text-gray-700',
    export: 'bg-purple-100 text-purple-800',
    import: 'bg-purple-100 text-purple-800',
    publish: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-700',
    archive: 'bg-orange-100 text-orange-800'
  }

  const color = colors[action] || 'bg-gray-100 text-gray-700'
  const label = ACTION_LABELS[action] || action

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

export default function ActivityPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: null,
    userEmail: '',
    action: ''
  })
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    limit: 25
  })

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      const offset = (pagination.current - 1) * pagination.limit
      const { data, count, error } = await getActivityLogs({
        category: filter.category,
        userEmail: filter.userEmail || null,
        action: filter.action || null,
        limit: pagination.limit,
        offset
      })

      if (!error) {
        setLogs(data)
        setPagination(prev => ({
          ...prev,
          total: Math.ceil((count || 0) / pagination.limit)
        }))
      }
      setLoading(false)
    }

    fetchLogs()
  }, [filter, pagination.current, pagination.limit])

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handleClearFilters = () => {
    setFilter({ category: null, userEmail: '', action: '' })
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  return (
    <div style={{ padding: '2rem', background: '#F7F6F3', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.8rem',
          fontWeight: 300,
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>
          Activity Log
        </h1>
        <p style={{ color: '#444', fontSize: '0.95rem' }}>
          Track all activities performed in the admin portal
        </p>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        border: '1px solid #e0ddd6',
        borderRadius: '4px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              Category
            </label>
            <select
              value={filter.category || ''}
              onChange={e => handleFilterChange('category', e.target.value || null)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '3px',
                fontSize: '0.9rem',
                fontFamily: 'var(--sans)',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value || 'all'} value={cat.value || ''}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Email Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              User Email
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input
                type="text"
                placeholder="Filter by email..."
                value={filter.userEmail}
                onChange={e => handleFilterChange('userEmail', e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '2rem',
                  paddingRight: '0.75rem',
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--sans)'
                }}
              />
            </div>
          </div>

          {/* Action Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
              Action
            </label>
            <input
              type="text"
              placeholder="Filter by action..."
              value={filter.action}
              onChange={e => handleFilterChange('action', e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '3px',
                fontSize: '0.9rem',
                fontFamily: 'var(--sans)'
              }}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearFilters}
          style={{
            padding: '0.5rem 1rem',
            background: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '3px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.target.style.background = '#e8e8e8'}
          onMouseLeave={e => e.target.style.background = '#f0f0f0'}
        >
          Clear Filters
        </button>
      </div>

      {/* Activity Logs Table */}
      <div style={{
        background: 'white',
        border: '1px solid #e0ddd6',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>
            Loading activity logs...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#444' }}>
            No activities found
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #e0ddd6' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#333', fontFamily: 'var(--sans)' }}>
                    Timestamp
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#333', fontFamily: 'var(--sans)' }}>
                    User
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#333', fontFamily: 'var(--sans)' }}>
                    Action
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#333', fontFamily: 'var(--sans)' }}>
                    Category
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#333', fontFamily: 'var(--sans)' }}>
                    Target
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={log.id} style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: idx % 2 === 0 ? 'white' : '#fafafa'
                  }}>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#444', fontFamily: 'var(--sans)' }}>
                      {formatDate(log.created_at)}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#333', fontFamily: 'var(--sans)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.user_email}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <ActionBadge action={log.action} category={log.category} />
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#444', fontFamily: 'var(--sans)', textTransform: 'capitalize' }}>
                      {log.category}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#444', fontFamily: 'var(--sans)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.target_name || log.target_id || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #e0ddd6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.85rem', color: '#444', fontFamily: 'var(--sans)' }}>
                Page {pagination.current} of {pagination.total} ({logs.length} results)
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
                  disabled={pagination.current === 1}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    background: 'white',
                    cursor: pagination.current === 1 ? 'not-allowed' : 'pointer',
                    opacity: pagination.current === 1 ? 0.5 : 1,
                    fontFamily: 'var(--sans)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: Math.min(prev.total, prev.current + 1) }))}
                  disabled={pagination.current === pagination.total}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    background: 'white',
                    cursor: pagination.current === pagination.total ? 'not-allowed' : 'pointer',
                    opacity: pagination.current === pagination.total ? 0.5 : 1,
                    fontFamily: 'var(--sans)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
