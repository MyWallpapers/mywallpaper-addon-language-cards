# Language Cards Add-on

Compact language-learning flashcards for
[MyWallpaper](https://github.com/MyWallpapers/MyWallpaper). The add-on uses
the canonical Canvas runtime and translates the generated word list through
the public MyMemory endpoint.

## Features

- Source and target language selection
- Clickable cards with optional automatic progression
- Adjustable text scale, colors and transparency
- Responsive layout for small layers

## Development

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

Use MyWallpaper's developer tools to load the local Vite origin. The release
bundle is `dist/index.html` plus `dist/assets/addon.js`; immutable tags are
consumed by the central admission workflow.

## License

MIT License
