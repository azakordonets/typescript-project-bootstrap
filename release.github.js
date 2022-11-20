const base = require('./release.gitlab.package')

module.exports = {
    ...base,
    plugins: [
        ...base.plugins.map((p) => (typeof p === 'string' ? p.replace('gitlab', 'github') : p)),
    ],
}
