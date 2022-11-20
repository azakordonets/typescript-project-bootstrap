import { makeUtils } from './utils'

import type { PackageJson } from '../types'
import { exec } from '../utils'

import chalk from 'chalk'

import type Fs from 'fs'
import path from 'path'

function readPackagedFile(fs: typeof Fs, fileName: string) {
    return fs.promises.readFile(path.join(__dirname, '..', '..', '..', fileName), 'utf-8')
}

const configTemplates = {
    // .config.js files
    '.eslintrc.js': () =>
        `module.exports = require('typescript-project-bootstrap/.eslintrc.typescript')`,
    'babel.config.js': () => `module.exports = require('typescript-project-bootstrap/babel.config')`,
    'commitlint.config.js': () =>
        `module.exports = require('typescript-project-bootstrap/commitlint.config')`,
    'jest.config.js': () => `module.exports = require('typescript-project-bootstrap/jest.config')`,
    'lint-staged.config.js': () =>
        `module.exports = require('typescript-project-bootstrap/lint-staged.config')`,
    'prettier.config.js': () =>
        `module.exports = require('typescript-project-bootstrap/prettier.config')`,
    'release.config.js': () =>
        `module.exports = require('typescript-project-bootstrap/release.package')`,

    // Plain config files
    '.gitignore': (fs: typeof Fs) => readPackagedFile(fs, '.gitignore.template'),
    '.npmrc': () =>
        [
            '//registry.npmjs.org',
            'package-lock=false',
        ].join('\n'),
    '.nvmrc': (fs: typeof Fs) => readPackagedFile(fs, '.nvmrc'),
    '.prettierignore': (fs: typeof Fs) => readPackagedFile(fs, '.prettierignore'),

    // json and yml configs
    'lefthook.yml': () => `extends:\n  - ./node_modules/typescript-project-bootstrap/lefthook.base.yml`,
    'tsconfig.json': () =>
        JSON.stringify(
            {
                ...require('../../../tsconfig.json'),
                extends: 'typescript-project-bootstrap/tsconfig.base.json',
            },
            null,
            2
        ),
    'tsconfig.dist.json': () =>
        JSON.stringify(
            {
                ...require('../../../tsconfig.dist.json'),
                extends: 'typescript-project-bootstrap/tsconfig.base.json',
            },
            null,
            2
        )
}

export function makeCreatePackage({ fs, root }: { fs: typeof Fs; root: string }) {
    const { enrichPackageJson, createConfigFile } = makeUtils({ fs, root })

    return async function createPackage(name: string, enrichmentPackageJson: PackageJson) {
        await Promise.all([
            exec('git', ['init'], { cwd: root }),
            // Initialize the src/ directory
            void fs.promises.mkdir(path.join(root, 'src'), { recursive: true }),

            // Initialize the index.ts file
            fs.promises.appendFile(path.join(root, 'index.ts'), ''),

            // Enrich (or create) the package.json file
            enrichPackageJson(name, enrichmentPackageJson),

            // Create config files
            ...Object.entries(configTemplates).map(([fileName, getContents]) =>
                createConfigFile(fileName, getContents).catch(console.error)
            ),
        ])

        if (fs.existsSync(path.join(root, 'node_modules', 'typescript-project-bootstrap'))) {
            await exec('npx', ['--no-install', 'lefthook', 'install'], { cwd: root }).catch(
                console.error
            )
        }
        console.log(chalk.yellow(`Done setting up ${chalk.blue(name)}!`))
        console.log(
            chalk.yellow(`Please run "${chalk.blue('npm install')}" to update your packages!`)
        )
    }
}
