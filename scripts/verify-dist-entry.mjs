import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const htmlPath = resolve(root, 'dist/index.html')
const addonPath = resolve(root, 'dist/assets/addon.js')

if (!existsSync(htmlPath) || !existsSync(addonPath)) {
  throw new Error('Expected dist/index.html and dist/assets/addon.js after build')
}

const html = readFileSync(htmlPath, 'utf8')
if (!html.includes('/assets/addon.js') && !html.includes('assets/addon.js')) {
  throw new Error('dist/index.html does not reference assets/addon.js')
}

const addon = readFileSync(addonPath, 'utf8')
if (!addon.includes('mount')) {
  throw new Error('dist/assets/addon.js does not contain the mount entry')
}

console.log('dist entry verified')
