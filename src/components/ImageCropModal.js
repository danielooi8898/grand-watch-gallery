'use client'
import { useEffect, useRef, useState } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

export default function ImageCropModal({ src, fileName, aspectRatio = 4/3, onApply, onCancel }) {
  const s = useRef({ pos:{x:0,y:0}, scale:1, minScale:1, natW:0, natH:0 })
  const [disp, setDisp] = useState({ pos:{x:0,y:0}, scale:1, natW:0, natH:0 })
  const [dragging, setDragging] = useState(false)
  const [applying, setApplying] = useState(false)
  const dragRef = useRef(null)
  const viewRef = useRef(null)

  const CROP_W = 480
  const CROP_H = Math.round(CROP_W / aspectRatio)

  const clamp = (x, y, sc) => {
    const { natW, natH } = s.current
    return {
      x: Math.min(0, Math.max(CROP_W - natW * sc, x)),
      y: Math.min(0, Math.max(CROP_H - natH * sc, y)),
    }
  }

  const push = (updates) => {
    Object.assign(s.current, updates)
    setDisp(d => ({ ...d, ...updates }))
  }

  const onImgLoad = (e) => {
    const natW = e.target.naturalWidth, natH = e.target.naturalHeight
    const minScale = Math.max(CROP_W / natW, CROP_H / natH)
    const pos = { x: (CROP_W - natW * minScale) / 2, y: (CROP_H - natH * minScale) / 2 }
    s.current = { pos, scale: minScale, minScale, natW, natH }
    setDisp({ pos, scale: minScale, natW, natH })
  }

  // Mouse drag via window listeners (avoids stale closures using refs)
  const onMouseDown = (e) => {
    e.preventDefault()
    dragRef.current = { mx: e.clientX, my: e.clientY, px: s.current.pos.x, py: s.current.pos.y }
    setDragging(true)
  }

  useEffect(() => {
    const move = (e) => {
      if (!dragRef.current) return
      const { mx, my, px, py } = dragRef.current
      const pos = clamp(px + e.clientX - mx, py + e.clientY - my, s.current.scale)
      s.current.pos = pos
      setDisp(d => ({ ...d, pos }))
    }
    const up = () => { dragRef.current = null; setDragging(false) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, []) // refs only — no stale closure issue

  // Non-passive wheel (required for preventDefault to work)
  useEffect(() => {
    const el = viewRef.current; if (!el) return
    const handler = (e) => {
      e.preventDefault()
      const { pos, scale, minScale, natW, natH } = s.current
      const rect = el.getBoundingClientRect()
      const px = e.clientX - rect.left, py = e.clientY - rect.top
      const newScale = Math.max(minScale, Math.min(minScale * 5, scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1)))
      const nx = px - (px - pos.x) / scale * newScale
      const ny = py - (py - pos.y) / scale * newScale
      const newPos = clamp(nx, ny, newScale)
      s.current.scale = newScale; s.current.pos = newPos
      setDisp(d => ({ ...d, scale: newScale, pos: newPos }))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onCancel])

  const zoomTo = (pct) => {
    const { pos, scale, minScale } = s.current
    const newScale = Math.max(minScale, minScale * (1 + pct / 100))
    const px = CROP_W / 2, py = CROP_H / 2
    const nx = px - (px - pos.x) / scale * newScale
    const ny = py - (py - pos.y) / scale * newScale
    const newPos = clamp(nx, ny, newScale)
    s.current.scale = newScale; s.current.pos = newPos
    setDisp(d => ({ ...d, scale: newScale, pos: newPos }))
  }

  const handleApply = async () => {
    setApplying(true)
    try {
      const { pos, scale } = s.current
      const img = new window.Image()
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = src })
      const OUT_W = 1600, OUT_H = Math.round(OUT_W / aspectRatio)
      const canvas = document.createElement('canvas')
      canvas.width = OUT_W; canvas.height = OUT_H
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, -pos.x / scale, -pos.y / scale, CROP_W / scale, CROP_H / scale, 0, 0, OUT_W, OUT_H)
      canvas.toBlob(blob => onApply(blob, (fileName || 'image').replace(/\.[^.]+$/, '.jpg')), 'image/jpeg', 0.92)
    } catch (err) { alert('Failed: ' + err.message); setApplying(false) }
  }

  const { pos, scale, natW, natH } = disp
  const { minScale } = s.current
  const zoomPct = minScale > 0 ? Math.round((scale / minScale - 1) * 100) : 0

  const btn = (onClick, children, gold) => (
    <button onClick={onClick} style={{ padding:'0.6rem 1.25rem', border: gold ? 'none' : '1px solid #E0DDD8', background: gold ? '#B08D57' : '#fff', color: gold ? '#fff' : '#555', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.75rem', fontWeight: gold ? 700 : 400, letterSpacing: gold ? '0.08em' : 0, textTransform: gold ? 'uppercase' : 'none', borderRadius:'4px' }}>
      {children}
    </button>
  )

  return (
    <div style={{ position:'fixed', inset:0, zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.78)', backdropFilter:'blur(8px)', padding:'1rem' }}>
      <div style={{ background:'#fff', borderRadius:'8px', width:'100%', maxWidth:`${CROP_W + 80}px`, boxShadow:'0 25px 80px rgba(0,0,0,0.5)', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem', borderBottom:'1px solid #F0EDE8' }}>
          <div>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', margin:0 }}>Adjust &amp; Crop</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#999', margin:'0.15rem 0 0' }}>Drag to reposition &middot; Scroll or slider to zoom</p>
          </div>
          <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', padding:'0.25rem', display:'flex' }}><X size={18}/></button>
        </div>

        {/* Crop viewport */}
        <div style={{ padding:'1.25rem', background:'#F7F5F2', display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
          <div ref={viewRef}
            style={{ width:CROP_W, height:CROP_H, overflow:'hidden', position:'relative', cursor:dragging?'grabbing':'grab', userSelect:'none', borderRadius:'4px', border:'2px solid #B08D57', background:'#ccc' }}
            onMouseDown={onMouseDown}
          >
            {natW === 0 && (
              <>
                <img src={src} alt="" onLoad={onImgLoad} style={{ display:'none' }} />
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#999' }}>Loading…</div>
              </>
            )}
            {natW > 0 && (
              <img src={src} draggable={false} alt=""
                style={{ position:'absolute', left:pos.x, top:pos.y, width:natW*scale, height:natH*scale, pointerEvents:'none' }}
              />
            )}
            {/* Rule-of-thirds overlay */}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
              {['33.33%','66.66%'].map(v => <div key={'v'+v} style={{ position:'absolute', left:v, top:0, bottom:0, borderLeft:'1px solid rgba(255,255,255,0.25)' }}/>)}
              {['33.33%','66.66%'].map(v => <div key={'h'+v} style={{ position:'absolute', top:v, left:0, right:0, borderTop:'1px solid rgba(255,255,255,0.25)' }}/>)}
            </div>
          </div>

          {/* Zoom row */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', width:CROP_W }}>
            <button onClick={() => zoomTo(Math.max(0, zoomPct - 10))} style={{ border:'1px solid #E0DDD8', background:'#fff', borderRadius:'4px', padding:'0.3rem 0.5rem', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <ZoomOut size={14} style={{ color:'#555' }}/>
            </button>
            <input type="range" min={0} max={300} value={zoomPct}
              onChange={e => zoomTo(Number(e.target.value))}
              style={{ flex:1, accentColor:'#B08D57', cursor:'pointer' }}
            />
            <button onClick={() => zoomTo(Math.min(300, zoomPct + 10))} style={{ border:'1px solid #E0DDD8', background:'#fff', borderRadius:'4px', padding:'0.3rem 0.5rem', cursor:'pointer', display:'flex', alignItems:'center' }}>
              <ZoomIn size={14} style={{ color:'#555' }}/>
            </button>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#888', minWidth:'3.5rem', textAlign:'right' }}>{zoomPct + 100}%</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.75rem', padding:'1rem 1.25rem', borderTop:'1px solid #F0EDE8' }}>
          {btn(onCancel, 'Cancel', false)}
          <button onClick={handleApply} disabled={applying || natW === 0}
            style={{ padding:'0.6rem 1.5rem', background:'#111', color:'#fff', border:'none', cursor:applying?'wait':'pointer', fontFamily:'var(--sans)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'4px', opacity:(applying||natW===0)?0.6:1 }}>
            {applying ? 'Processing…' : 'Apply & Upload'}
          </button>
        </div>

      </div>
    </div>
  )
}
