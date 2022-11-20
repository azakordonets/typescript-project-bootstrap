import { makeCreatePackage } from './create/package'
import { ProjectLanguage, ProjectType } from './types'

import type { Argv } from 'yargs'

import type Fs from 'fs'

function builder(yargs: Argv) {
    return yargs
        .option('type', {
            type: 'string',
            default: ProjectType.Package,
            // TODO: add other options
            choices: [ProjectType.Package],
        })
        .positional('name', {
            type: 'string',
            demandOption: true,
        })
        .option('language', {
            type: 'string',
            default: ProjectLanguage.Typescript,
            // TODO: add other options
            choices: [ProjectLanguage.Typescript],
        })
}

function makeHandler(fs: typeof Fs) {
    return async function handler({
        language,
        name,
        type: projectType,
    }: ReturnType<typeof builder>['argv']) {
        const root = process.env.INIT_CWD ?? process.cwd()

        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
        const packageJson = require('../../package.json')

        if (language !== ProjectLanguage.Typescript) {
            throw new Error('not implemented yet')
        }
        if (projectType === ProjectType.Package) {
            const createPackage = makeCreatePackage({ fs, root })
            await createPackage(name, packageJson)
        } else {
            throw new Error('not implemented')
        }
    }
}

export function makeCreateCommand(fs: typeof Fs) {
    return {
        command: 'create <name>',
        description: 'creates the boilerplate for a project',
        builder,
        handler: makeHandler(fs),
    }
}
