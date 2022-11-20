module.exports = {
    branches: [
        {
            name:
                process.env['CI_DEFAULT_BRANCH'] !== undefined
                    ? process.env['CI_DEFAULT_BRANCH']
                    : 'main',
        },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                releaseRules: [
                    {
                        type: 'chore',
                        release: 'patch',
                    },
                    {
                        type: 'refactor',
                        release: 'patch',
                    },
                ],
            },
        ],
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/gitlab',
        '@semantic-release/npm',
        [
            '@semantic-release/git',
            {
                assets: [
                    'CHANGELOG.md',
                    'package.json',
                    'package-lock.json',
                    'yarn.lock',
                    'README.md',
                ],
                message: 'chore(release): ${nextRelease.version}',
            },
        ],
    ],
}
