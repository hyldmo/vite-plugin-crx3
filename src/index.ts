/// <reference path="./crx3.d.ts" />
import fs from 'node:fs'
import path from 'node:path'
import crx3Pack from 'crx3'
import type { Plugin } from 'vite'

/**
 * Options for the crx3 plugin
 */
export interface CrxOptions {
	/** Output directory for the .crx file (resolved relative to project root) */
	outDir: string
	/** Name of the output .crx file */
	outFileName: string
	/** Optional private key for signing. C
	 * an be a filepath (relative to project root or absolute) or PEM content string.
	 * If not provided, will use key.pem from project root or generate a temporary key */
	pem?: string
}

export function crx3(options: CrxOptions): Plugin {
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

			// 1. If options.pem provided, check if it's a filepath or PEM content
			if (options.pem) {
				const resolvedPemPath = path.isAbsolute(options.pem)
					? options.pem
					: path.resolve(rootDir, options.pem)

				if (fs.existsSync(resolvedPemPath) && fs.statSync(resolvedPemPath).isFile()) {
					// It's a filepath, use it directly
					keyPath = resolvedPemPath
				} else {
					// It's PEM content, write to temp file
					usingTempKey = true
					keyPath = path.join(rootDir, 'temp.pem')
					fs.writeFileSync(keyPath, options.pem)
				}
			}

			// 2. If no options.pem and no local key.pem, crx3 will generate it at keyPath ('key.pem')

			console.log('Packing extension to .crx...')

			try {
				const outputPath = path.join(outDir, options.outFileName)

				await crx3Pack([distDir], {
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
