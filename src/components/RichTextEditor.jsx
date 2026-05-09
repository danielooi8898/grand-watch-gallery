'use client'
import { useRef, useEffect } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
    onChange(editorRef.current?.innerHTML || '')
  }

  const insertTemplate = () => {
    const template = `<h2>Model</h2><p></p><p><strong>Case Diameter:</strong></p><p></p><p><strong>Bezel:</strong></p><p></p><p><strong>Dial:</strong></p><p></p><p><strong>Case:</strong></p><p></p><p><strong>Calibre:</strong></p><p></p><p><strong>Bracelet/Strap:</strong></p><p></p><p><strong>Clasp/Buckle:</strong></p><p></p><p><strong>Condition:</strong></p><p></p><p><strong>Included:</strong></p><p></p>`
    editorRef.current.innerHTML = template
    onChange(template)
  }

  const btnStyle = {
    padding: '0.4rem 0.6rem',
    border: '1px solid #ccc',
    background: '#fff',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontFamily: 'var(--sans)',
    color: '#111',
    minWidth: '32px',
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '3px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '8px',
        background: '#f5f5f5',
        borderBottom: '1px solid #ccc',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <select
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            if (e.target.value) {
              execCmd('formatBlock', `<${e.target.value}>`)
              e.target.value = ''
            }
          }}
          style={{ ...btnStyle, width: 'auto', minWidth: '80px' }}
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Paragraph</option>
        </select>

        <div style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 4px' }} />

        <button onMouseDown={(e) => { e.preventDefault(); execCmd('bold') }} style={btnStyle} title="Bold">
          <strong>B</strong>
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); execCmd('italic') }} style={btnStyle} title="Italic">
          <em>I</em>
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); execCmd('underline') }} style={btnStyle} title="Underline">
          <u>U</u>
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); execCmd('strikeThrough') }} style={btnStyle} title="Strikethrough">
          <s>S</s>
        </button>

        <div style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 4px' }} />

        <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList') }} style={btnStyle} title="Bullet List">
          ≡
        </button>
        <button onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList') }} style={btnStyle} title="Numbered List">
          ≡
        </button>

        <div style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 4px' }} />

        <button onMouseDown={(e) => { e.preventDefault(); insertTemplate() }} style={{ ...btnStyle, background: '#B08D57', color: '#fff' }} title="Insert Template">
          Template
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '14px',
          color: '#111',
          minHeight: '250px',
          padding: '12px',
          background: '#fff',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      />

      {/* Styles */}
      <style jsx>{`
        [contenteditable] {
          font-family: var(--sans);
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable] h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        [contenteditable] h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        [contenteditable] h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        [contenteditable] p { margin: 0.5em 0; }
        [contenteditable] ul { list-style-type: disc; margin: 0.5em 0; padding-left: 2em; }
        [contenteditable] ol { list-style-type: decimal; margin: 0.5em 0; padding-left: 2em; }
        [contenteditable] li { display: list-item; margin: 0.25em 0; }
      `}</style>
    </div>
  )
}

export default RichTextEditor
