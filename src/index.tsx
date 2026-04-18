import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useSettings, useViewport } from '@mywallpaper/sdk-react'

type LanguageCode = string

interface Settings {
  sourceLanguage: LanguageCode
  targetLanguage: LanguageCode
  autoNextSeconds: number
  textScale: number
  cardColor: string
  textColor: string
  transparency: number
}

interface TranslationPair {
  sourceText: string
  targetText: string
}

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get'

const DEFAULT_SETTINGS: Settings = {
  sourceLanguage: 'fr',
  targetLanguage: 'en',
  autoNextSeconds: 0,
  textScale: 100,
  cardColor: '#FFF8F0',
  textColor: '#231B14',
  transparency: 14,
}

const SEED_WORDS = [
  'hello',
  'goodbye',
  'please',
  'thank you',
  'friend',
  'family',
  'water',
  'bread',
  'coffee',
  'ticket',
  'hotel',
  'map',
  'book',
  'computer',
  'project',
  'question',
  'answer',
  'train',
  'passport',
  'happy',
]

function mergeSettings(raw: Partial<Settings>): Settings {
  return { ...DEFAULT_SETTINGS, ...raw }
}

function pickNextSeed(currentSeed: string | null): string {
  if (SEED_WORDS.length === 1) return SEED_WORDS[0]
  const candidates = SEED_WORDS.filter((word) => word !== currentSeed)
  const pool = candidates.length > 0 ? candidates : SEED_WORDS
  return pool[Math.floor(Math.random() * pool.length)] ?? SEED_WORDS[0]
}

function normalizeHex(hex: string): string {
  const value = hex.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const [, r, g, b] = value
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return '#ffffff'
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex).slice(1)
  const value = Number.parseInt(normalized, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

async function translateWord(term: string, targetLanguage: LanguageCode): Promise<string> {
  if (targetLanguage === 'en') return term

  const params = new URLSearchParams({
    q: term,
    langpair: `en|${targetLanguage}`,
  })

  const response = await fetch(`${MYMEMORY_URL}?${params.toString()}`)
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`)

  const payload = (await response.json()) as {
    responseData?: { translatedText?: string }
  }

  const translatedText = payload.responseData?.translatedText?.trim()
  if (!translatedText) throw new Error('Empty translation response')
  return translatedText
}

export default function LanguageCards() {
  const viewport = useViewport()
  const rawSettings = useSettings<Partial<Settings>>()
  const settings = mergeSettings(rawSettings)

  const [currentSeed, setCurrentSeed] = useState<string>(() => pickNextSeed(null))
  const [pair, setPair] = useState<TranslationPair | null>(null)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const cacheRef = useRef(new Map<string, TranslationPair>())

  const compactLayout = viewport.width < 360 || viewport.height < 280
  const scale = settings.textScale / 100
  const cardColor = normalizeHex(settings.cardColor)
  const textColor = normalizeHex(settings.textColor)
  const transparency = Math.min(70, Math.max(0, settings.transparency)) / 100
  const dividerColor = withAlpha(textColor, 0.14)
  const cardSurface = withAlpha(cardColor, 1 - transparency)

  useEffect(() => {
    if (settings.sourceLanguage === settings.targetLanguage) return

    const cacheKey = `${currentSeed}:${settings.sourceLanguage}:${settings.targetLanguage}`
    const cachedPair = cacheRef.current.get(cacheKey)
    if (cachedPair) {
      setPair(cachedPair)
      setTranslationError(null)
      return
    }

    let cancelled = false
    setPair(null)
    setTranslationError(null)

    void Promise.all([
      translateWord(currentSeed, settings.sourceLanguage),
      translateWord(currentSeed, settings.targetLanguage),
    ])
      .then(([sourceText, targetText]) => {
        if (cancelled) return
        const nextPair = { sourceText, targetText }
        cacheRef.current.set(cacheKey, nextPair)
        setPair(nextPair)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setTranslationError(error instanceof Error ? error.message : 'Unable to translate this word')
      })

    return () => {
      cancelled = true
    }
  }, [currentSeed, settings.sourceLanguage, settings.targetLanguage])

  useEffect(() => {
    if (settings.autoNextSeconds <= 0) return

    const timer = window.setTimeout(() => {
      setCurrentSeed((current) => pickNextSeed(current))
    }, settings.autoNextSeconds * 1000)

    return () => window.clearTimeout(timer)
  }, [currentSeed, settings.autoNextSeconds])

  const moveToNextCard = (): void => {
    setCurrentSeed((current) => pickNextSeed(current))
  }

  const shellStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    padding: compactLayout ? 12 : 18,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
    background: 'transparent',
  }

  const cardStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: 0,
    display: 'grid',
    alignItems: 'center',
    padding: compactLayout ? '20px 18px' : '28px 24px',
    borderRadius: compactLayout ? 24 : 32,
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    appearance: 'none',
    textAlign: 'center',
    overflow: 'hidden',
  }

  const contentStyle: CSSProperties = {
    width: '100%',
    display: 'grid',
    gap: compactLayout ? 14 : 18,
    justifyItems: 'center',
    padding: compactLayout ? '10px 8px' : '12px 10px',
    position: 'relative',
    zIndex: 1,
  }

  if (settings.sourceLanguage === settings.targetLanguage) {
    return (
      <div style={shellStyle}>
        <div style={{ ...cardStyle, cursor: 'default' }}>
          <div style={{ ...contentStyle, color: textColor }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Choose two different languages</div>
          </div>
        </div>
      </div>
    )
  }

  if (translationError) {
    return (
      <div style={shellStyle}>
        <div style={{ ...cardStyle, cursor: 'default' }}>
          <div style={{ ...contentStyle, color: textColor }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Translation unavailable</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={shellStyle}>
      <button type="button" onClick={moveToNextCard} style={cardStyle}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: compactLayout ? 24 : 32,
            background: cardSurface,
          }}
        />
        <div style={contentStyle}>
          <div
            style={{
              fontSize: (compactLayout ? 30 : 42) * scale,
              lineHeight: 0.95,
              fontWeight: 800,
              color: textColor,
              textWrap: 'balance',
            }}
          >
            {pair?.sourceText ?? '...'}
          </div>

          <div
            style={{
              width: compactLayout ? 54 : 64,
              height: 1,
              margin: '0 auto',
              background: dividerColor,
            }}
          />

          <div
            style={{
              fontSize: (compactLayout ? 24 : 34) * scale,
              lineHeight: 0.98,
              fontWeight: 700,
              color: textColor,
              textWrap: 'balance',
            }}
          >
            {pair?.targetText ?? '...'}
          </div>
        </div>
      </button>
    </div>
  )
}
