import type { PackageJson } from '../types'

import type Fs from 'fs'
import path from 'path'

export function makeUtils({ fs, root }: { fs: typeof Fs; root: string }) {
    async function enrichPackageJson(name: string, enrichment: PackageJson) {
        const packageJsonPath = path.join(root, 'package.json')
        const packageJson = JSON.parse(
            await fs.promises.readFile(packageJsonPath, 'utf-8').catch(() => '{}')
        ) as PackageJson

        const enriched: PackageJson = {
            ...packageJson,
            version: packageJson.version ?? '1.0.0',
            name,
            description: packageJson.description ?? '',
            author: enrichment.author ?? 'unknown',
            license: enrichment.license ?? 'ISC',
            main: 'index.js',
            types: 'index.d.ts',
            files: [
                'index.*',
                '!index.ts',
                'src/*',
                '!src/*.ts',
                'src/*.d.ts',
                'src/**/*',
                '!src/**/*.ts',
                'src/**/*.d.ts',
                '!*.spec.js',
                '!*.spec.ts',
                '!**/*.spec.js',
                '!**/*.spec.js',
            ],
            scripts: {
                ...packageJson.scripts,
                ...Object.fromEntries(
                    Object.entries(enrichment.scripts ?? {})
                        .filter(([k]) => k !== 'postinstall')
                        .map(([k, v]) => [
                            k,
                            // Remove the `cp .gitignore` from the build script
                            // That's only needed for the typescript-project-bootstrap package
                            k === 'build' && v?.includes('&& cp .gitignore')
                                ? v.replace('&& cp .gitignore .gitignore.template', '').trim()
                                : v,
                        ])
                ),
            },
            dependencies: {
                ...packageJson.dependencies,
                tslib:
                    packageJson.dependencies?.tslib ??
                    enrichment.dependencies?.tslib ??
                    enrichment.devDependencies?.tslib ??
                    '^1.14.1',
            },
            devDependencies: {
                ...Object.fromEntries(
                    Object.entries(packageJson.devDependencies ?? {}).filter(
                        ([name]) => enrichment.dependencies?.[name] === undefined
                    )
                ),
                'typescript-project-bootstrap': `^${enrichment.version ?? '1.0.0'}`,
                typescript: enrichment.devDependencies?.typescript ?? '^4.0.3',
            },
        }

        await fs.promises.writeFile(packageJsonPath, JSON.stringify(enriched, null, 2))
    }

    async function createConfigFile(
        fileName: string,
        getContents: (fs: typeof Fs) => string | Promise<string>
    ) {
        const filePath = path.join(root, fileName)
        await fs.promises.writeFile(filePath, `${(await getContents(fs)).trim()}\n`)
    }

    return { enrichPackageJson, createConfigFile }
}
