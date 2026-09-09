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

## Publishing

Merge the source and matching manifest/package version into the reviewed default
branch, wait for quality checks, then push a new immutable `v<version>` tag.
Open this add-on's management page in MyWallpaper and select that tag to request
publication with an active lifetime entitlement.

MyWallpaper resolves the exact public repository and commit, dispatches its
pinned central workflow, rebuilds and verifies the artifacts, and publishes the
immutable transport from the platform repository. The add-on repository needs
no publication workflow or MyWallpaper credential. Do not pre-create a GitHub
release: a source tag alone does not publish the add-on to the catalogue.

Each accepted newer release is available for new installations. Existing
wallpapers remain pinned to their exact release until explicitly changed.
