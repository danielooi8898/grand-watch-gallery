'use client'
import { useEffect, useRef, useState } from 'react'

const QUILL_JS  = 'https://cdn.quilljs.com/1.3.6/quill.js'
const QUILL_CSS = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
const LOAD_TIMEOUT_MS = 6000

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const initializedRef = useRef(false)
  const modeRef = useRef('loading') // 'loading' | 'ready' | 'failed'
  const [mode, setMode] = useState('loading')

  const setModeBoth = (m) => { modeRef.current = m; setMode(m) }

  useEffect(() => {
    if (initializedRef.current || !editorRef.current) return
    initializedRef.current = true

    const failTimer = setTimeout(() => {
      if (modeRef.current === 'loading') setModeBoth('failed')
    }, LOAD_TIMEOUT_MS)

    if (window.Quill) {
      initQuill()
    } else {
      const script = document.createElement('script')
      script.src = QUILL_JS
      script.onload = initQuill
      script.onerror = () => {
        if (modeRef.current === 'loading') setModeBoth('failed')
      }
      document.body.appendChild(script)

      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = QUILL_CSS
      document.head.appendChild(style)
    }

    function initQuill() {
      if (quillRef.current || !editorRef.current) return
      // If we've already fallen back to the plain textarea (e.g. slow load
      // that resolved after the timeout), don't yank the UI out from under
      // the admin — the textarea stays the source of truth for this session.
      if (modeRef.current === 'failed') return

      try {
        const quill = new window.Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'header': [2, 3, false] }],
              [{ 'list': 'bullet' }, { 'list': 'ordered' }],
              ['clean']
            ]
          }
        })

        // Add custom template button after toolbar is created
        setTimeout(() => {
          const toolbar = document.querySelector('.ql-toolbar')
          if (toolbar) {
            const templateBtn = document.createElement('button')
            templateBtn.className = 'ql-custom-template'
            templateBtn.type = 'button'
            templateBtn.textContent = 'Template'
            templateBtn.style.cssText = 'padding: 4px 8px !important; border: none !important; background: #B08D57 !important; color: #fff !important; border-radius: 2px !important; cursor: pointer !important; font-size: 12px !important; font-weight: bold !important; margin: 0 2px !important; width: auto !important; height: auto !important;'

            templateBtn.addEventListener('click', (e) => {
              e.preventDefault()
              e.stopPropagation()
              const template = `<p><strong>Model</strong></p><p><strong>Case Diameter:</strong></p><p><strong>Bezel:</strong></p><p><strong>Dial:</strong></p><p><strong>Case:</strong></p><p><strong>Calibre:</strong></p><p><strong>Bracelet/Strap:</strong></p><p><strong>Clasp/Buckle:</strong></p><p><strong>Condition:</strong></p><p><strong>Included:</strong></p>`
              quill.root.innerHTML = template
              onChange(template)
            })

            toolbar.appendChild(templateBtn)
          }
        }, 100)

        if (value) {
          quill.root.innerHTML = value
        }

        quill.on('text-change', () => {
          onChange(quill.root.innerHTML)
        })

        quillRef.current = quill
        clearTimeout(failTimer)
        setModeBoth('ready')
      } catch (err) {
        console.error('Quill init error:', err)
        setModeBoth('failed')
      }
    }

    return () => {
      clearTimeout(failTimer)
    }
  }, [])

  return (
    <>
      <style>{`
        .ql-container {
          font-size: 14px !important;
          color: #111 !important;
          font-family: var(--sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif) !important;
        }
        .ql-editor {
          min-height: 300px !important;
          padding: 12px !important;
          background: #fff !important;
          color: #111 !important;
        }
        .ql-editor p {
          margin: 0.5em 0 !important;
        }
        .ql-editor h2, .ql-editor h3 {
          margin: 0.75em 0 !important;
        }
        .ql-editor ul {
          list-style-type: disc !important;
          margin: 0.5em 0 !important;
          padding-left: 2em !important;
        }
        .ql-editor ol {
          list-style-type: decimal !important;
          margin: 0.5em 0 !important;
          padding-left: 2em !important;
        }
        .ql-editor li {
          margin: 0.25em 0 !important;
          list-style-type: inherit !important;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #E8E2D8 !important;
          background: #f9f7f4 !important;
          padding: 8px !important;
        }
        .ql-toolbar button {
          width: 32px !important;
          height: 32px !important;
          border: 1px solid #ccc !important;
          background: #fff !important;
          border-radius: 2px !important;
          margin: 0 2px !important;
        }
        .ql-toolbar button:hover {
          background: #f0f0f0 !important;
        }
        .ql-toolbar button.ql-active {
          background: #e8e8e8 !important;
        }
        .ql-toolbar select {
          border: 1px solid #ccc !important;
          background: #fff !important;
          border-radius: 2px !important;
          margin: 0 2px !important;
          padding: 4px 8px !important;
        }
        .ql-stroke {
          stroke: #111 !important;
        }
        .ql-fill {
          fill: #111 !important;
        }
        .ql-picker-label {
          color: #111 !important;
        }
      `}</style>
      <div
        style={{
          border: '1px solid #E8E2D8',
          borderRadius: '3px',
          background: '#fff',
          overflow: 'hidden',
          minHeight: '340px',
          position: 'relative'
        }}
      >
        <div ref={editorRef} style={{ display: mode === 'failed' ? 'none' : 'block' }} />

        {mode === 'loading' && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#aaa', fontSize: '0.78rem',
            fontFamily: 'var(--sans, sans-serif)', pointerEvents: 'none'
          }}>
            Loading editor…
          </div>
        )}

        {mode === 'failed' && (
          <div>
            <p style={{
              fontFamily: 'var(--sans, sans-serif)', fontSize: '0.68rem',
              color: '#dc2626', padding: '8px 12px 0', margin: 0
            }}>
              Rich text editor couldn&apos;t load (network issue) — using plain text mode. Your text is still saved normally.
            </p>
            <textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%', minHeight: '290px', border: 'none', outline: 'none',
                padding: '12px', fontSize: '14px', fontFamily: 'var(--sans, sans-serif)',
                color: '#111', resize: 'vertical', boxSizing: 'border-box'
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default RichTextEditor
