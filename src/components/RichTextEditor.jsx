'use client'
import { useEffect, useRef } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current || !editorRef.current) return
    initializedRef.current = true

    if (window.Quill) {
      initQuill()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdn.quilljs.com/1.3.6/quill.js'
      script.onload = initQuill
      document.body.appendChild(script)

      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
      document.head.appendChild(style)
    }

    function initQuill() {
      if (quillRef.current || !editorRef.current) return

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
        const toolbar = document.querySelector('.ql-toolbar')
        if (toolbar) {
          const templateBtn = document.createElement('button')
          templateBtn.className = 'ql-custom-template'
          templateBtn.innerHTML = 'Template'
          templateBtn.style.cssText = 'padding: 4px 8px; border: 1px solid #ccc; background: #B08D57; color: #fff; border-radius: 2px; cursor: pointer; font-size: 12px; font-weight: bold; margin: 0 2px;'

          templateBtn.addEventListener('click', (e) => {
            e.preventDefault()
            const template = `<h2>Model</h2><p></p><p><strong>Case Diameter:</strong></p><p></p><p><strong>Bezel:</strong></p><p></p><p><strong>Dial:</strong></p><p></p><p><strong>Case:</strong></p><p></p><p><strong>Calibre:</strong></p><p></p><p><strong>Bracelet/Strap:</strong></p><p></p><p><strong>Clasp/Buckle:</strong></p><p></p><p><strong>Condition:</strong></p><p></p><p><strong>Included:</strong></p><p></p>`
            quill.root.innerHTML = template
            onChange(template)
          })

          toolbar.appendChild(templateBtn)
        }

        if (value) {
          quill.root.innerHTML = value
        }

        quill.on('text-change', () => {
          onChange(quill.root.innerHTML)
        })

        quillRef.current = quill
      } catch (err) {
        console.error('Quill init error:', err)
      }
    }

    return () => {
      // Cleanup
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
          overflow: 'hidden'
        }}
      >
        <div ref={editorRef} />
      </div>
    </>
  )
}

export default RichTextEditor
