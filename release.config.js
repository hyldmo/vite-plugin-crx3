import path from 'node:path'
import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'))

export default {
	branches: ['main'],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		'@semantic-release/npm',
		[
			'@semantic-release/github',
			{
				assets: ['dist/**']
			}
		],
		[
			'@semantic-release/git',
			{
				assets: ['package.json', 'yarn.lock', 'CHANGELOG.md'],
				message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
			}
		]
	]
}

