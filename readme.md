## Yeoman generator for Polymer projects [![Build Status](https://secure.travis-ci.org/yeoman/generator-polymer.svg?branch=master)](https://travis-ci.org/yeoman/generator-polymer)

<img src="http://i.imgur.com/9PDzAid.png"/>

## Introduction

[Polymer](http://www.polymer-project.org/) is a library of polyfills and sugar which enable the use of Web Components in modern browsers. The project allows developers to build apps using the platform of tomorrow and inform the W3C of places where in-flight specifications can be further improved.

`generator-polymer` provides Polymer scaffolding using [Yeoman](http://yeoman.io) (a scaffolding tool for the web), letting you easily create and customize Polymer (custom) elements via the command-line and import them using HTML Imports. This saves you time writing boilerplate code so you can start writing up the logic to your components straight away.

## Features

* A Polymer app scaffold built with HTML5 Boilerplate
* Sub-generator to create Polymer elements for your app
* Boilerplate to create reusable Polymer elements
* Quick deploy to GitHub pages
* All the goodness of `seed-element` (docs & landing page for your element)

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
- [polymer:el](#el)
- [polymer:seed](#seed)
- [polymer:gh](#gh)

**Note: Generators are to be run from the root of your app**

### App
Sets up a new Polymer app, generating all the boilerplate you need to get started.

Example:
```bash
yo polymer
```

### El
Generates a polymer element in `app/elements`.

Example:
```bash
yo polymer:el my-element
```

**Note: You must pass in an element name, and the name must contain a dash "-"**

### Seed
Generates a reusable polymer element based on the [seed-element workflow](http://www.polymer-project.org/docs/start/reusableelements.html). **This should only be used if you're creating a standalone element repo that you intend to share with others via bower.** If you're just building a Polymer app, stick to the [El](#el) generator.

To create a seed-element you'll first need to create a parent directory, then a sub directory to hold your seed-element. All bower dependencies will be installed into the parent directory. Please follow the [seed-element guide](http://www.polymer-project.org/docs/start/reusableelements.html) for more instructions.

Example:
```bash
mkdir -p components/x-foo && cd $_
yo polymer:seed
```

### Gh
Generates a Github pages branch for your [seed-element](#seed).

Example:
```bash
cd components/x-foo
yo polymer:gh
```

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
