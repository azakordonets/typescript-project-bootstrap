module.exports = {
    '*.{js,jsx,ts,tsx}': ['npx --no-install eslint --fix --cache=true'],
    '*.{json,yml,yaml}': ['npx --no-install prettier --write'],
}
