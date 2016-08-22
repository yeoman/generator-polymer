[![npm version](https://img.shields.io/npm/v/generator-polymer.svg)](http://npmjs.org/generator-polymer)
[![npm downloads](https://img.shields.io/npm/dm/generator-polymer.svg)](http://npmjs.org/generator-polymer)
[![Build Status](https://img.shields.io/travis/yeoman/generator-polymer/master.svg)](https://travis-ci.org/yeoman/generator-polymer)
[![Dependency Status](https://img.shields.io/david/yeoman/generator-polymer.svg)](https://david-dm.org/yeoman/generator-polymer)

## Deprecation warning

We encourage you to take a look at 
[Polymer CLI](https://github.com/Polymer/polymer-cli) which contains many of the 
same features as this generator and has a larger team supporting it. We plan to
deprecate and eventually remove this project from GitHub and direct all future
support toward Polymer CLI. The good news is it uses Yeoman under the hood so
I'll see you there!

## Yeoman generator for Polymer projects

<img src="http://i.imgur.com/dsFChIk.png">

## Introduction

[Polymer](http://www.polymer-project.org/) is a library of polyfills and sugar which enable the use of Web Components in modern browsers. The project allows developers to build apps using the platform of tomorrow and inform the W3C of places where in-flight specifications can be further improved.

`generator-polymer` provides Polymer scaffolding using [Yeoman](http://yeoman.io) (a scaffolding tool for the web), letting you easily create and customize Polymer (custom) elements via the command-line and import them using HTML Imports. This saves you time writing boilerplate code so you can start writing up the logic to your components straight away.

## Features

* A Polymer app scaffold built with [Polymer Starter Kit](https://developers.google.com/web/tools/polymer-starter-kit/)
* Sub-generator to create Polymer elements for your app
* Quick deploy to GitHub pages
* All the goodness of [seed-element](https://github.com/polymerelements/seed-element) (docs & landing page for your element)
* [web-component-tester](https://github.com/Polymer/web-component-tester) support

## Issues

This generator clones [Polymer Starter Kit](https://github.com/PolymerElements/polymer-starter-kit) and [seed-element](https://github.com/polymerelements/seed-element). If you're having issues with the template files generated for those projects, please raise them on those repos as they are the canonical source.

## Installation

Install the generator
`npm install -g generator-polymer`

Make a new directory and cd into it
`mkdir -p my-project && cd $_`

Scaffold a new Polymer project:
`yo polymer`

## Generators

Available generators:

- [polymer (aka polymer:app)](#app)
- [polymer:element](#element-alias-el)
- [polymer:seed](#seed)
- [polymer:gh](#gh)

**Note: Generators are to be run from the root of your app**

### App
Sets up a new Polymer app, generating all the boilerplate you need to get started.

Example:
```bash
yo polymer
```

### Element (alias: El)
Generates a polymer element in `app/elements` and optionally appends an import to `app/elements/elements.html`.

Example:
```bash
yo polymer:element my-element

# or use the alias

yo polymer:el my-element
```

**Note: You must pass in an element name, and the name must contain a dash "-"**

One can also include element dependencies to be imported. For instance, if you're creating a `fancy-menu` element which needs to import `paper-button` and `paper-checkbox` as dependencies, you can generate the file like so:

```bash
yo polymer:el fancy-menu paper-button paper-checkbox
```

#### Options

```
--docs, include iron-component-page docs with your element and demo.html
--path, override default directory structure, ex: --path foo/bar will put your element in app/elements/foo/bar
```

### Seed
Generates a reusable polymer element based on the [seed-element workflow](https://github.com/polymerelements/seed-element). **This should only be used if you're creating a standalone element repo that you intend to share with others via bower.** If you're just building a Polymer app, stick to the [Element](#element-alias-el) generator.

To preview your new element you'll want to use the [polyserve](https://github.com/PolymerLabs/polyserve) tool.

Example:
```bash
mkdir -p my-foo && cd $_
yo polymer:seed my-foo
polyserve
```

### Gh
Generates a Github pages branch for your [seed-element](#seed).

**This requires that you have [SSH keys setup on GitHub](https://help.github.com/articles/generating-ssh-keys/)**.

**Windows users will need to have [Git Bash](https://git-for-windows.github.io/) installed**

If your documentation or demo pages have dependencies declared as devDependencies in `bower.json`, they will be included in your GitHub pages branch.

Example:
```bash
cd my-foo
yo polymer:gh
```

If, for some reason, you don't want the devDependencies, use the `--nodevdeps` option.

#### Github Enterprise
Github Enterprise instances require a custom hostname to be defined. Use the `--hostname` option.

Example:
```bash
cd my-foo
yo polymer:gh --hostname custom.host.com
```

## Testing

The project generated by `yo polymer` contains support for [web-component-tester](https://github.com/Polymer/web-component-tester). The following commands are included:

Run local tests (in terminal):
```bash
gulp test:local
```

Run remote tests with [SauceLabs](https://saucelabs.com/):
```bash
gulp test:remote
```

See the [web-component-tester readme](https://github.com/Polymer/web-component-tester#configuration) for configuration options.

## Gotchas

### The `elements.html` file

The `app` generator will produce an `elements.html` file where you can place your imports. This file will be [vulcanized](https://www.polymer-project.org/articles/concatenating-web-components.html) when you run the default `gulp` task. **You'll want to make sure that elements.html is the only import in your index.html file, otherwise there's a good chance you'll accidentally load Polymer twice and break the app**.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
