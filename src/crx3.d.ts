declare module 'crx3' {
	interface CRX3Options {
		/** Name used for files, if they are not specified otherwise. */
		name?: string
		/** Path name of output CRX file. */
		crxPath?: string
		/** Optional path name of output ZIP file. */
		zipPath?: string
		/** Private key to be used for signing CRX file. */
		keyPath?: string
		/** Optional path name of output Update Manifest XML file. */
		xmlPath?: string
		/** Optional version name to be written into Update Manifest file. */
		appVersion?: string
		/** Optional extension file URL name to be written into Update Manifest file. */
		crxURL?: string
		/** Optional minimum supported browser version name. */
		browserVersion?: string
		/** List of paths to include. */
		srcPaths?: string[]
		/** File creation time (UNIX timestamp). */
		forceDateTime?: number
	}

	interface CRX3Result {
		appId: string
		newKey?: string
		[key: string]: unknown
	}

	function crx3(files: string[], options?: CRX3Options): Promise<CRX3Result>

	export = crx3
}
