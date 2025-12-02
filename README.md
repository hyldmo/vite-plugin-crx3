# vite-plugin-crx3

Vite plugin to pack Chrome extensions into .crx files based on `crx3`

## Installation

```bash
yarn add -D vite-plugin-crx3
```

## Usage

In your `vite.config.ts`:

```ts
import { crx3 } from 'vite-plugin-crx3'

export default defineConfig({
  plugins: [
    crx3({
      outDir: 'release',
      outFileName: 'my-extension.crx',
    })
  ]
})
```

## Options

- `outDir`: Output directory for the .crx file.
- `outFileName`: Name of the output .crx file.
- `pem`: (Optional) Private key string for signing.
