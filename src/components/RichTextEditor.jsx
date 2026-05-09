'use client'
import { useRef } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const editorRef = useRef(null)
  const savedSelection = useRef(null)

  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0)
    }
  }

  const restoreSelection = () => {
    const sel = window.getSelection()
    if (savedSelection.current) {
      sel.removeAllRanges()
      sel.addRange(savedSelection.current)
    }
  }

  const formatText = (command, value = null) => {
    restoreSelection()
    document.execCommand(command, false, value)
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertTemplateText = () => {
    const template = `<h2>Model</h2><p></p><p><strong>Case Diameter:</strong></p><p></p><p><strong>Bezel:</strong></p><p></p><p><strong>Dial:</strong></p><p></p><p><strong>Case:</strong></p><p></p><p><strong>Calibre:</strong></p><p></p><p><strong>Bracelet/Strap:</strong></p><p></p><p><strong>Clasp/Buckle:</strong></p><p></p><p><strong>Condition:</strong></p><p></p><p><strong>Included:</strong></p><p></p>`
    editorRef.current.innerHTML = template
    onChange(template)
  }

  return (
    <div style={{ border: '1px solid #E8E2D8', borderRadius: '3px', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '8px',
        background: '#f9f7f4',
        borderBottom: '1px solid #E8E2D8',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Paragraph styles */}
        <select
          onMouseDown={saveSelection}
          onChange={(e) => {
            if (e.target.value) {
              restoreSelection()
              document.execCommand('formatBlock', false, `<${e.target.value}>`)
              updateContent()
              e.target.value = ''
            }
          }}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'inherit'
          }}
        >
          <option value="">Style</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div style={{ width: '1px', height: '20px', background: '#ddd' }} />

        <button
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); formatText('bold') }}
          title="Bold"
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          B
        </button>

        <button
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); formatText('italic') }}
          title="Italic"
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            fontStyle: 'italic'
          }}
        >
          I
        </button>

        <button
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); formatText('underline') }}
          title="Underline"
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            textDecoration: 'underline'
          }}
        >
          U
        </button>

        <button
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); formatText('strikeThrough') }}
          title="Strikethrough"
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            textDecoration: 'line-through'
          }}
        >
          S
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ddd' }} />

        <button
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); formatText('insertUnorderedList') }}
          title="Bullet List"
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          •
        </button>

        <button
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); formatText('insertOrderedList') }}
          title="Numbered List"
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            background: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          1.
        </button>

        <div style={{ width: '1px', height: '20px', background: '#ddd' }} />

        <button
          onMouseDown={(e) => { e.preventDefault(); editorRef.current.focus(); insertTemplateText() }}
          title="Insert Template"
          style={{
            padding: '4px 8px',
            border: 'none',
            background: '#B08D57',
            color: '#fff',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          Template
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={updateContent}
        onBlur={updateContent}
        onMouseDown={saveSelection}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
          updateContent()
        }}
        style={{
          fontFamily: 'var(--sans)',
          fontSize: '14px',
          color: '#111',
          minHeight: '300px',
          padding: '12px',
          background: '#fff',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          direction: 'ltr',
          textAlign: 'left'
        }}
      />

      {/* Styles */}
      <style jsx>{`
        [contenteditable] {
          font-family: var(--sans);
          direction: ltr;
          text-align: left;
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
