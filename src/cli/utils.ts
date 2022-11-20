import child from 'child_process'

interface Options {
    cwd?: string
}
export async function exec(command: string, args: string[] = [], { cwd }: Options = {}) {
    const p = child.spawn(command, args, { cwd: cwd ?? process.env.INIT_CWD ?? process.cwd() })
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
    return new Promise<void>((resolve, reject) => {
        p.on('error', reject)
        p.on('exit', (code) => (code !== 0 ? reject(code) : resolve()))
    })
}
