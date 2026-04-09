import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { existsSync } from 'fs'

const PUBLIC_IMAGES = new URL('../public/images', import.meta.url).pathname

const TEAM_DIRS = ['team']
const MAX_WIDTH_DEFAULT = 1920
const MAX_WIDTH_TEAM = 800

async function findImages(dir) {
  const results = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await findImages(full)))
    } else {
      const ext = extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        results.push(full)
      }
    }
  }
  return results
}

function isTeamImage(filePath) {
  return TEAM_DIRS.some((d) => filePath.includes(`/images/${d}/`))
}

function targetPath(filePath) {
  const ext = extname(filePath).toLowerCase()
  // SVGs stay as-is, keep WebP as WebP, convert JPG/PNG → WebP
  if (ext === '.webp') return filePath
  const dir = dirname(filePath)
  const name = basename(filePath, ext)
  return join(dir, `${name}.webp`)
}

async function optimizeImage(filePath) {
  const maxW = isTeamImage(filePath) ? MAX_WIDTH_TEAM : MAX_WIDTH_DEFAULT
  const ext = extname(filePath).toLowerCase()
  const out = targetPath(filePath)

  try {
    const meta = await sharp(filePath).metadata()
    const width = Math.min(meta.width ?? maxW, maxW)

    await sharp(filePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(out)

    const inStat = await stat(filePath)
    const outStat = await stat(out)
    const saved = ((1 - outStat.size / inStat.size) * 100).toFixed(1)
    const sameFile = out === filePath

    console.log(
      `✓ ${filePath.replace(PUBLIC_IMAGES, '')} → ${sameFile ? '(in-place)' : out.replace(PUBLIC_IMAGES, '')} | ${(inStat.size / 1024).toFixed(0)}KB → ${(outStat.size / 1024).toFixed(0)}KB (${saved}% smaller)`
    )
  } catch (err) {
    console.error(`✗ ${filePath}: ${err.message}`)
  }
}

const images = await findImages(PUBLIC_IMAGES)
console.log(`Found ${images.length} images to process...\n`)

for (const img of images) {
  await optimizeImage(img)
}

console.log('\nDone.')
