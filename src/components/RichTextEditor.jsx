'use client'
import { useRef, useState, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Code, Heading2 } from 'lucide-react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const [html, setHtml] = useState(value || '')
  const editorRef = useRef(null)

  useEffect(() => {
    setHtml(value || '')
  }, [value])

  const updateContent = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
      setHtml(newHtml)
      onChange(newHtml)
    }
  }

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value)
    updateContent()
    editorRef.current?.focus()
  }

  const btnStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #E8E2D8',
    background: '#fff',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
  }

  const ToolButton = ({ onClick, icon: Icon, title }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={btnStyle}
      onMouseEnter={e => e.target.style.background = '#fafaf9'}
      onMouseLeave={e => e.target.style.background = '#fff'}
    >
      <Icon size={16} />
    </button>
  )

  return (
    <div style={{ border: '1px solid #E8E2D8', borderRadius: '2px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.5rem',
        background: '#F9F8F6',
        borderBottom: '1px solid #E8E2D8',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <ToolButton
          onClick={() => applyFormat('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolButton
          onClick={() => applyFormat('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolButton
          onClick={() => applyFormat('formatBlock', 'h2')}
          icon={Heading2}
          title="Heading"
        />
        <ToolButton
          onClick={() => applyFormat('formatBlock', 'pre')}
          icon={Code}
          title="Code Block"
        />
        <div style={{ width: '1px', height: '20px', background: '#E8E2D8' }} />
        <ToolButton
          onClick={() => applyFormat('insertUnorderedList')}
          icon={List}
          title="Bullet List"
        />
        <ToolButton
          onClick={() => applyFormat('insertOrderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        onBlur={updateContent}
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.82rem',
          color: '#111',
          minHeight: '100px',
          padding: '0.85rem',
          background: '#fff',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : placeholder}
      </div>

      {/* Editor Styles */}
      <style jsx>{`
        :global([contenteditable]) p {
          margin: 0.5em 0;
        }
        :global([contenteditable] h2) {
          margin: 0.75em 0 0.5em 0;
          font-size: 1.25em;
          font-weight: 700;
        }
        :global([contenteditable] ul, [contenteditable] ol) {
          margin: 0.5em 0;
          padding-left: 1.5em;
        }
        :global([contenteditable] li) {
          margin: 0.25em 0;
        }
        :global([contenteditable] code) {
          background: #f5f5f5;
          padding: 0.1em 0.3em;
          border-radius: 2px;
          font-family: monospace;
        }
        :global([contenteditable] pre) {
          background: #f5f5f5;
          padding: 0.75em;
          border-radius: 3px;
          overflow-x: auto;
          margin: 0.5em 0;
        }
        :global([contenteditable] pre code) {
          background: none;
          padding: 0;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
