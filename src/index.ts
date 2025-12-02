/// <reference path="./crx3.d.ts" />
import fs from 'node:fs'
import path from 'node:path'
import crx3 from 'crx3'
import type { Plugin } from 'vite'

export interface Options {
	outDir: string
	outFileName: string
	pem?: string
}

export function crxPack(options: Options): Plugin {
	return {
		name: 'vite-plugin-crx3',
		apply: 'build',
		async closeBundle() {
			const rootDir = process.cwd()
			const distDir = path.join(rootDir, 'dist')
			const outDir = path.resolve(rootDir, options.outDir)

			// Default key path
			let keyPath = path.join(rootDir, 'key.pem')
			let usingTempKey = false

			if (!fs.existsSync(distDir)) {
				console.error('dist/ directory not found, skipping crx pack.')
				return
			}

			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir, { recursive: true })
			}

			// 1. If options.pem provided, write to temp file
			if (options.pem) {
				usingTempKey = true
				keyPath = path.join(rootDir, 'temp.pem')
				fs.writeFileSync(keyPath, options.pem)
			}

			// 2. If no options.pem and no local key.pem, crx3 will generate it at keyPath ('key.pem')

			console.log('Packing extension to .crx...')

			try {
				const outputPath = path.join(outDir, options.outFileName)

				await crx3([distDir], {
					keyPath: keyPath,
					crxPath: outputPath
				})

				console.log(`Successfully created: ${outputPath}`)
			} catch (err) {
				console.error('Error packing extension:', err)
			} finally {
				// Cleanup temp key if used
				if (usingTempKey && fs.existsSync(keyPath)) {
					fs.unlinkSync(keyPath)
				}
			}
		}
	}
}
