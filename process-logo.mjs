import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const inputPath = join(__dirname, 'public', 'GWG_LOGO.png')
const outputPath = join(__dirname, 'public', 'GWG_LOGO_clean.png')

// Load image and get raw RGB pixel data
const image = sharp(inputPath)
const metadata = await image.metadata()
console.log(`Image: ${metadata.width}x${metadata.height}, channels: ${metadata.channels}`)

const { data, info } = await sharp(inputPath)
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
console.log(`Raw data: ${width}x${height}, ${channels} channels, ${data.length} bytes`)

// Create RGBA output buffer
const outData = Buffer.alloc(width * height * 4)

let keptPixels = 0
let removedPixels = 0

for (let i = 0; i < width * height; i++) {
  const srcIdx = i * channels
  const dstIdx = i * 4

  const r = data[srcIdx]
  const g = data[srcIdx + 1]
  const b = data[srcIdx + 2]

  // Keep only bright/white pixels (the actual logo text/elements)
  // The logo text is white/light, background is dark checkerboard
  const brightness = (r + g + b) / 3

  if (brightness > 140) {
    // White/light pixel — this is the logo
    // Use brightness as alpha for smooth edges
    const alpha = Math.min(255, Math.round(((brightness - 140) / (255 - 140)) * 255 * 1.4))
    outData[dstIdx]     = r
    outData[dstIdx + 1] = g
    outData[dstIdx + 2] = b
    outData[dstIdx + 3] = Math.min(255, alpha)
    keptPixels++
  } else {
    // Dark pixel — background, make transparent
    outData[dstIdx]     = 0
    outData[dstIdx + 1] = 0
    outData[dstIdx + 2] = 0
    outData[dstIdx + 3] = 0
    removedPixels++
  }
}

console.log(`Kept: ${keptPixels}, Removed: ${removedPixels}`)

// Save as RGBA PNG
await sharp(outData, {
  raw: { width, height, channels: 4 }
}).png().toFile(outputPath)

console.log(`Saved: ${outputPath}`)
