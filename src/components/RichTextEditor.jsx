'use client'
import { useEffect, useRef, useState } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const containerRef = useRef(null)
  const quillRef = useRef(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized || !containerRef.current) return

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
      if (quillRef.current || !containerRef.current) return

      try {
        const quill = new window.Quill(containerRef.current, {
          theme: 'snow',
          placeholder: 'Enter description...',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ header: [2, 3, false] }],
              ['bullet', 'ordered'],
              ['clean']
            ]
          }
        })

        // Set initial value if provided
        if (value) {
          quill.root.innerHTML = value
        }

        // Track changes
        quill.on('text-change', () => {
          onChange(quill.root.innerHTML)
        })

        quillRef.current = quill
        setInitialized(true)
      } catch (err) {
        console.error('Quill init error:', err)
      }
    }

    return () => {
      if (quillRef.current && !initialized) {
        quillRef.current = null
      }
    }
  }, [initialized, onChange, value])

  return (
    <>
      <style>{`
        .ql-container {
          font-size: 14px !important;
          color: #111 !important;
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
        .ql-editor ul, .ql-editor ol {
          margin: 0.5em 0 !important;
          padding-left: 2em !important;
        }
        .ql-editor li {
          list-style-position: inside !important;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #E8E2D8 !important;
          background: #f9f7f4 !important;
          padding: 8px !important;
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
        <div ref={containerRef} />
      </div>
    </>
  )
}

export default RichTextEditor
