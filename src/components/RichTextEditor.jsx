'use client'
import { useEffect, useRef } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const containerRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    // Load Quill from CDN
    const script = document.createElement('script')
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js'
    script.async = true

    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    document.head.appendChild(style)

    script.onload = () => {
      if (containerRef.current && window.Quill) {
        const Quill = window.Quill

        const quill = new Quill(containerRef.current, {
          theme: 'snow',
          placeholder: placeholder,
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'header': [2, 3, false] }],
              ['bullet', 'ordered'],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              ['clean']
            ]
          }
        })

        // Set initial value
        if (value) {
          quill.root.innerHTML = value
        }

        // Handle changes
        quill.on('text-change', () => {
          onChange(quill.root.innerHTML)
        })

        quillRef.current = quill
      }
    }

    document.head.appendChild(script)

    return () => {
      if (quillRef.current) {
        quillRef.current = null
      }
    }
  }, [onChange, placeholder])

  return (
    <div
      ref={containerRef}
      style={{
        border: '1px solid #E8E2D8',
        borderRadius: '3px',
        background: '#fff',
        minHeight: '400px'
      }}
    />
  )
}

export default RichTextEditor
