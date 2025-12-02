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
      pem: 'path/to/key.pem', // filepath to your private key
    })
  ]
})
```

You can also provide PEM content directly as a string:

```ts
crx3({
  outDir: 'release',
  outFileName: 'my-extension.crx',
  pem: process.env.PRIVATE_KEY, // PEM content string
})
```

## Options

- `outDir`: Output directory for the .crx file.
- `outFileName`: Name of the output .crx file.
- `pem`: Private key for signing. Can be a filepath (relative to project root or absolute) or PEM content string. If not provided, will use `key.pem` from project root or generate a temporary key (which will be lost after the build).
