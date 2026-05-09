'use client'
import { useRef, useState, useEffect } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const editorRef = useRef(null)
  const [isEmpty, setIsEmpty] = useState(!value)
  const selectionRef = useRef(null)

  // Initialize editor content from value prop
  useEffect(() => {
    if (editorRef.current) {
      if (value && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value
      }
      setIsEmpty(!value || value.trim() === '')
    }
  }, [value])

  const updateContent = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML
      setIsEmpty(!newHtml || newHtml.trim() === '')
      onChange(newHtml)
    }
  }

  // Save selection before button click
  const onEditorMouseDown = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      selectionRef.current = selection.getRangeAt(0)
    }
  }

  // Restore selection and apply format
  const applyFormat = (command, val = null) => {
    const selection = window.getSelection()

    // Restore saved selection if available
    if (selectionRef.current) {
      selection.removeAllRanges()
      selection.addRange(selectionRef.current)
    }

    // Ensure editor has focus
    editorRef.current?.focus()

    // Apply the command
    try {
      document.execCommand(command, false, val)
    } catch (e) {
      console.error('execCommand failed:', e)
    }

    // Update content
    updateContent()

    // Clear saved selection
    selectionRef.current = null
  }

  const insertTemplate = () => {
    const template = `<h2>Model</h2><p></p><p><strong>Case Diameter:</strong></p><p></p><p><strong>Bezel:</strong></p><p></p><p><strong>Dial:</strong></p><p></p><p><strong>Case:</strong></p><p></p><p><strong>Calibre:</strong></p><p></p><p><strong>Bracelet/Strap:</strong></p><p></p><p><strong>Clasp/Buckle:</strong></p><p></p><p><strong>Condition:</strong></p><p></p><p><strong>Included:</strong></p><p></p>`
    editorRef.current.innerHTML = template
    updateContent()
    editorRef.current?.focus()
  }

  const btnStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #E8E2D8',
    background: '#fff',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: 600,
    fontFamily: 'var(--sans)',
    color: '#111',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  }

  const handleButtonMouseDown = (e, command, val) => {
    e.preventDefault()
    applyFormat(command, val)
  }

  const handleTemplateMouseDown = (e) => {
    e.preventDefault()
    insertTemplate()
  }

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
        alignItems: 'center',
        userSelect: 'none'
      }}>
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, 'bold')}
          title="Bold (Ctrl+B)"
          style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#fafaf9'}
          onMouseLeave={e => e.target.style.background = '#fff'}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, 'italic')}
          title="Italic (Ctrl+I)"
          style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#fafaf9'}
          onMouseLeave={e => e.target.style.background = '#fff'}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, 'formatBlock', 'h2')}
          title="Heading"
          style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#fafaf9'}
          onMouseLeave={e => e.target.style.background = '#fff'}
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, 'formatBlock', 'pre')}
          title="Code Block"
          style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#fafaf9'}
          onMouseLeave={e => e.target.style.background = '#fff'}
        >
          Code
        </button>
        <div style={{ width: '1px', height: '20px', background: '#E8E2D8' }} />
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, 'insertUnorderedList')}
          title="Bullet List"
          style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#fafaf9'}
          onMouseLeave={e => e.target.style.background = '#fff'}
        >
          • List
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleButtonMouseDown(e, 'insertOrderedList')}
          title="Numbered List"
          style={btnStyle}
          onMouseEnter={e => e.target.style.background = '#fafaf9'}
          onMouseLeave={e => e.target.style.background = '#fff'}
        >
          1. List
        </button>
        <div style={{ width: '1px', height: '20px', background: '#E8E2D8' }} />
        <button
          type="button"
          onMouseDown={handleTemplateMouseDown}
          title="Insert template"
          style={{ ...btnStyle, background: '#B08D57', color: '#fff' }}
          onMouseEnter={e => e.target.style.background = '#9a7647'}
          onMouseLeave={e => e.target.style.background = '#B08D57'}
        >
          Template
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onMouseDown={onEditorMouseDown}
        onInput={updateContent}
        onBlur={updateContent}
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.82rem',
          color: '#111',
          minHeight: '200px',
          padding: '0.85rem',
          background: '#fff',
          outline: 'none',
        }}
      >
        {isEmpty && <span style={{ color: '#ccc' }}>{placeholder}</span>}
      </div>

      {/* Editor Styles */}
      <style jsx>{`
        [contenteditable] {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable] p {
          margin: 0.5em 0;
          display: block;
        }
        [contenteditable] h2 {
          margin: 0.75em 0 0.5em 0;
          font-size: 1.25em;
          font-weight: 700;
          display: block;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
          display: block;
        }
        [contenteditable] li {
          margin: 0.25em 0;
          display: list-item;
        }
        [contenteditable] code {
          background: #f5f5f5;
          padding: 0.1em 0.3em;
          border-radius: 2px;
          font-family: monospace;
        }
        [contenteditable] pre {
          background: #f5f5f5;
          padding: 0.75em;
          border-radius: 3px;
          overflow-x: auto;
          margin: 0.5em 0;
          display: block;
          font-family: monospace;
        }
        [contenteditable] pre code {
          background: none;
          padding: 0;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
