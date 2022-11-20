# typescript-project-bootstrap

This package contains reusable configurations, that can easily be included in every type of Javascript/Typescript project.     
It can also be used to bootstrap the initial configuration for a new package.

## How it works

In order to install the package in your project, the package manager needs to fetch typescript-project-bootstrap package from npm registry.

### Installing `typescript-project-bootstrap` as a `devDependency`

```sh
npm install --save-dev typescript-project-bootstrap

# Short version
npm i -D  typescript-project-bootstrap

# Version with yarn
yarn add --dev  typescript-project-bootstrap
```

## How to use it

### Bootstrapping/updating all the config files

Included with the package is a small [CLI tool](./src/cli/README.md) that provides the command to bootstrap your projects.

To bootstrap a typescript package, simply run the following command (NOTE: pay attention to the [`npx`](https://www.npmjs.com/package/npx)! It will use the `node_modules/.bin` if it exists, so the second time will be faster!)

```sh
npx typescript-project-bootstrap create --type package --language typescript my-package

# shorthand: the CLI will add the  prefix for packages
npx typescript-project-bootstrap create --type package --language typescript my-package
```

This will create all the [configuration files](#configuration-files) needed for your type of project!

### Update a package

To update a package, simply bootstrap again! It may override some files that we didn't want to, but `git` has our back here! Just be sure to check the files before staging them!

### Configuration files

Configuration files for a lot of scenarios are included in this package: `jest`, `eslint`, `prettier`, etc. However, to set it up in your project, you still need to create a config file that includes it (sort of like a "proxy").

For example, to include the `eslint` configuration you need to create a `.eslintrc.js` file like so:

```js
// .eslintrc.js
module.exports = require('typescript-project-bootstrap/.eslintrc.typescript')
```

That also allows to extend the base configuration:

```js
// .eslintrc.js
const base = require('typescript-project-bootstrap/.eslintrc.typescript')
module.exports = {
    ...base,
    overrides: [
        ...(base.overrides !== undefined ? base.overrides : []),
        {
            files: ['src/**/*.type.ts'],
            rules: {
                '@typescript-eslint/no-unused-vars': 'warn',
                '@typescript-eslint/consistent-type-imports': 'off',
            },
        },
    ],

}
```

## FAQ

### Custom configurations VS standard configurations

By using `*.config.js` type of files, you can gain a lot of our customization opportunities.This is especially useful to allow package-users of the `typescript-project-bootstrap` to customize the behavior without requiring to first make a PR on this package.

### Which release configuration should I use in my project?

This package provides different release configuration templates:

- [Package release](./release.gitlab.package.js) for packages
- [GitHub release](./release.github.js) for open sourced packages

### Why [`lefthook`](https://github.com/Arkweid/lefthook#lefthook) instead of [`husky`](https://github.com/typicode/husky#husky)?

Because `husky` registers to every existing git-hook, and executes `node` on each of them. If you're a frequent committer, then you'll notice some performance improvement with `lefthook`! It only registers to the hooks that are specified, and runs a small `Go`-binary to launch the configured commands.

### I already had `husky` configured, how do I switch?

First of all, you'll need to transfer your hook commands from your `husky` config to the `lefthook.yml`. Note that by default, `typescript-project-bootstrap` already comes with a config file that you can extend: [`lefthook.base.yml`](./lefthook.base.yml). This should be enough for most projects, but feel free to extend it with your own hooks, or suggest additional hooks to be added to the `lefthook.base.yml`!

With the following commands, you can clean up the hooks that were registered by `husky` and replace them with `lefthook` hooks. Note: this assumes you have `typescript-project-bootstrap` already installed.

```sh
# Remove all existing hooks
rm ./.git/hooks/*

# Re-initialize all the hooks
npx --no-install @arkweid/lefthook install
```
### The `package.json` is changed on a postinstall. I don't want that, can I disable that?

Well yes, you can! But be extra careful here. Most of the scripts added to the `package.json` file are used in some form by the githooks or the default pipeline scripts. Make sure to add all required scripts like `lint`, `check:types`, `test:coverage` and more to your local package.json file. 

To be super sure see the `post-install` script in `./bin` and make sure all scripts from the `updatableScripts` array are available in your `package.json` file.

Add the option `preventScriptUpdates` to your `package.json` file like so: 

```json
{
  "name": "my-awesome-package",
  "version": "1.2.3",
  "private": true,
  // there it is:
  "preventScriptUpdates": true,
  "author": "Batman", 
}
```