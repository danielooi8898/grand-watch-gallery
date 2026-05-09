'use client'
import { useEffect, useRef } from 'react'

const RichTextEditor = ({ value, onChange, placeholder = 'Enter text...' }) => {
  const editorRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    // Load Jodit from CDN (lightweight, works great, no dependencies)
    if (!window.Jodit) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jodit/4.1.39/jodit.min.js'
      script.async = true

      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = 'https://cdnjs.cloudflare.com/ajax/libs/jodit/4.1.39/jodit.min.css'

      document.head.appendChild(style)

      script.onload = () => {
        initEditor()
      }
      document.head.appendChild(script)
    } else {
      initEditor()
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destruct()
      }
    }
  }, [])

  const initEditor = () => {
    if (!editorRef.current || !window.Jodit) return

    const config = {
      readonly: false,
      toolbar: true,
      spellcheck: false,
      language: 'en',
      toolbarButtonSize: 'small',
      buttons: 'bold,italic,underline,strikethrough,|,ul,ol,|,heading,|,template,removeFormat',
      buttonsMD: 'bold,italic,underline,strikethrough,|,ul,ol,|,heading,|,template,removeFormat',
      buttonsSM: 'bold,italic,underline,strikethrough,|,ul,ol,|,template',
      buttonsXS: 'bold,italic,underline',
      height: 300,
      minHeight: 300,
      statusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      defaultActionOnPaste: 'insert_as_text',
      disablePlugins: ['drag-and-drop', 'resizer'],
      askBeforePasteAsHTML: false,
      askBeforePasteFromWord: false,
      controls: {
        template: {
          name: 'template',
          displayName: 'Template',
          icon: 'file',
          exec: (editor) => {
            const template = `<h2>Model</h2><p></p><p><strong>Case Diameter:</strong></p><p></p><p><strong>Bezel:</strong></p><p></p><p><strong>Dial:</strong></p><p></p><p><strong>Case:</strong></p><p></p><p><strong>Calibre:</strong></p><p></p><p><strong>Bracelet/Strap:</strong></p><p></p><p><strong>Clasp/Buckle:</strong></p><p></p><p><strong>Condition:</strong></p><p></p><p><strong>Included:</strong></p><p></p>`
            editor.value = template
          }
        }
      }
    }

    try {
      const editor = new window.Jodit(editorRef.current, config)
      editor.value = value || ''

      editor.events.on('change', () => {
        onChange(editor.value)
      })

      instanceRef.current = editor
    } catch (err) {
      console.error('Failed to initialize Jodit:', err)
    }
  }

  return (
    <div>
      <div id="editor" ref={editorRef} style={{ minHeight: '300px' }} />
    </div>
  )
}

export default RichTextEditor
