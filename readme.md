## A Yeoman generator for Polymer projects.

<img src="http://i.imgur.com/J7bp9al.png" width="250px"/>

## Introduction

[Polymer](http://www.polymer-project.org/) is a library of polyfills and sugar which enable the use of Web Components in modern browsers. The project allows developers to build apps using the platform of tomorrow and inform the W3C of places where in-flight specifications can be further improved.

`generator-polymer` provides Polymer scaffolding using [Yeoman](http://yeoman.io) (a scaffolding tool for the web), letting you easily create and customize Polymer (custom) elements via the command-line and import them using HTML Imports. This saves you time writing boilerplate code so you can start writing up the logic to your components straight away.


## Features

* Minimal HTML5 Boilerplate
* Scaffolding for both Polymer elements and Custom elements
* Wire up HTML imports
* Edit and LiveReload for custom elements
* Support for SASS Bootstrap
* JSHint linting for projects
* HTML/CSS/JS optimization


## Preview

![](http://i.imgur.com/hrAO7M1.gif)


## Installation

```
# Install the generator
$ npm install -g generator-polymer

# Make a new directory and cd into it
$ mkdir my-new-project && cd $_

# Start using the generator
$ yo polymer

# Preview what was scaffolded
$ grunt server
```

## Getting started

Feel like building with the future? Let's scaffold out a Polymer app with two custom elements - a button and a panel. 

To begin, we run `yo polymer`. This scaffolds out our initial index.html, directory structure and Grunt tasks for our workflow. 

```shell
$ yo polymer

Out of the box I include HTML5 Boilerplate and Polymer.
[?] Would you like to include Twitter Bootstrap for Sass? Yes
```

Example:

![](http://i.imgur.com/3H9DtME.png)

If you would like to edit and have the browser LiveReload on each save, fire up `grunt server`. Our initial app should look a little like this:

<img src="http://i.imgur.com/hRHs2XQ.png" width="650px"/>

Next, we run `yo polymer:element button` to create the button element. 

It asks us a few questions such as whether we would like to include a constructor or import the button into our index.html using HTML imports. Let's say no to the first two options for now and leave the third option blank.

Note: If we say 'yes' to the second question, it will import the element via `button.html` and add `<button-element></button-element>` to our index so that the element rendered on the page.

```shell
$ yo polymer:element button
[?] Would you like to include constructor=””? No
[?] Import to your index.html using HTML imports? No
[?] Import other elements into this one? (e.g "another_element.html" or leave blank) 
   create app/elements/button.html
```

This creates a new element in the `/elements` directory named `button.html` that looks a little like this:

```html
<polymer-element name="button-element"  attributes="">
  <template>
    <style>
      @host { :scope {display: block;} }
    </style>
    <span>I'm <b>button-element</b>. This is my Shadow DOM.</span>
  </template>
  <script>
    Polymer('button-element', {
      //applyAuthorStyles: true,
      //resetStyleInheritance: true,
      created: function() { },
      enteredView: function() { },
      leftView: function() { },
      attributeChanged: function(attrName, oldVal, newVal) { }
    });
  </script>
</polymer-element>
```

Next, let's create our panel element by running `yo polymer:element panel`. 

This time we will ask for the panel to be imported into `index.html` using HTML imports as we wish for it to appear on the page. For the thid option this time, we specify `button` as the element we would like to include.

```shell
$ yo polymer:element panel
[?] Would you like to include constructor=””? No
[?] Import to your index.html using HTML imports? Yes
[?] Import other elements into this one? (e.g "another_element.html" or leave blank) button.html
   create app/elements/panel.html

```

As before, a new element will be added to `/elements`, this time named `panel.html` resembling: 

```html
<link rel="import" href="button.html">
<polymer-element name="panel-element"  attributes="">
  <template>
    <style>
      @host { :scope {display: block;} }
    </style>
    <span>I'm <b>panel-element</b>. This is my Shadow DOM.</span>
        <button-element></button-element>
  </template>
  <script>
    Polymer('panel-element', {
      //applyAuthorStyles: true,
      //resetStyleInheritance: true,
      created: function() { },
      enteredView: function() { },
      leftView: function() { },
      attributeChanged: function(attrName, oldVal, newVal) { }
    });
  </script>
</polymer-element>
```

Yeoman will have both imported the button element into panel.html using HTML imports but also have added `<button-element></button-element>` to your newly created element.

Snippet from index.html:

```html
  <link rel="import" href="elements/panel.html">
</head>
<body>
    <div class="container">
        <div class="hero-unit">
            <h1>'Allo, 'Allo!</h1>
            <p>You now have</p>
            <ul>
                <li>HTML5 Boilerplate</li>
                <li>Polymer</li>
                <li>Bootstrap</li>
            </ul>
            <p>installed.</p>
            <h3>Enjoy coding! - Yeoman</h3>
        </div>
    </div>

  <script>
    document.addEventListener('WebComponentsReady', function() {
        // Perform some behaviour
    });
  </script>

    <!-- build:js scripts/vendor.js -->
    <script src="bower_components/polymer/polymer.min.js"></script>
    <!-- endbuild -->
  <panel-element></panel-element>
```

What will be rendered to the page is an element (panel) which uses another element (button). 

Adding a little background color and width to our elements via scoped styles, we can get something that looks like this:

![](http://i.imgur.com/b6SPme1.png)

So far all you've had to do is just run a few commands in the terminal. You can now go and create as many new elements as you would like! Rock on.


## Generators

Available generators:

* `polymer:element` is used to scaffold out new individual Polymer elements. For example: `yo polymer:element carousel`

* `polymer:app` is used to scaffold your initial index.html/workflow/grunt tasks recommended for the project


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
  scaffolding has finished.

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched for
  another supported testing framework like `jasmine`.


## Build process

We are currently still evaluating how a build process and asset optimization fit in a world using Web Components. Early experiments into how one might concatenate and optimize such projects can be found in [this](https://github.com/addyosmani/polymer-grunt-example) repo.

## Notes

Once the generator/yo is installed, you'll also have access to Bower, where you can now install `polymer-elements` and `polymer-ui-elements`. These are additional collections of premade Polymer Web Components for use in your project. They can be installed by running `bower install polymer-elements polymer-ui-elements` in the terminal.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
