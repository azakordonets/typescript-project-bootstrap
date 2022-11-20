export type Dict<T> = Record<string, T | undefined>

export interface PackageJson {
    name?: string
    description?: string
    author?: string
    license?: string
    main?: string
    types?: string
    files?: string[]
    version?: string
    scripts?: Dict<string>
    dependencies?: Dict<string>
    devDependencies?: Dict<string>
}

export enum ProjectType {
    Package = 'package',
}

export enum ProjectLanguage {
    Javascript = 'javascript',
    Typescript = 'typescript',
}
