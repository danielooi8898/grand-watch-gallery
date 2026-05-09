'use client'
import { useEffect, useRef, useState } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const containerRef = useRef(null)
  const quillRef = useRef(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only initialize once
    if (initialized || !containerRef.current) return

    // Load Quill from CDN
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
      if (quillRef.current) return

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

      if (value) {
        quill.root.innerHTML = value
      }

      quill.on('text-change', () => {
        onChange(quill.root.innerHTML)
      })

      quillRef.current = quill
      setInitialized(true)
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
    }
  }, [initialized, onChange, value])

  return (
    <div
      ref={containerRef}
      style={{
        border: '1px solid #E8E2D8',
        borderRadius: '3px',
        background: '#fff'
      }}
    />
  )
}

export default RichTextEditor
