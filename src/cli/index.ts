import { makeCreateCommand } from './create'

import yargs from 'yargs'

import fs from 'fs'

export function run() {
    const commands = yargs.command(makeCreateCommand(fs)).demandCommand().help().strict()
    return commands.argv
}
