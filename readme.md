# A Yeoman generator for Polymer projects.

## Usage

Install: `npm install -g generator-polymer`

Make a new directory and `cd` into it:
```
mkdir my-new-project && cd $_
```


Start using the generator:

```
$ yo polymer
$ grunt server

$ yo polymer:element button
[?] Would you like to include constructor=””? No
[?] Import to your index.html using HTML imports? No
[?] Import any other elements into this new one? (e.g "button carousel")
   create app/elements/button.html


$ yo polymer:element panel
[?] Would you like to include constructor=””? No
[?] Import to your index.html using HTML imports? Yes
[?] Import any other elements into this new one? (e.g "button carousel") button
   create app/elements/panel.html

```
This will scaffold out a Polymer app with two elements. A `panel-element` which has been imported into
index.html for you with it's own custom element boilerplate and a `button-element` which has been imported
into `panel-element` with some boilerplate within the `template` tag.

You can of course just `yo polymer:element button` and include it in your index directly.


## Generators

Available generators:

- polymer:element
- polymer:app
- polymer:custom-element

## Preview

```
   _-----_
    |       |
    |--(o)--|   .--------------------------.
   `---------´  |    Welcome to Yeoman,    |
    ( _´U`_ )   |   ladies and gentlemen!  |
    /___A___\   '__________________________'
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

Out of the box I include HTML5 Boilerplate, Modernizr and Polymer
[?] What prefixed name would you like to call your new element? carousel
[?] Would you like to include constructor=””? No
[?] Which other elements would you like to include? (space separate with paths)
```

## Options

* `--coffee`
  
  Generate scaffolds in CoffeeScript.
  RequireJS is not supported with `--coffee` option for now.

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
  scaffolding has finished.

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched for
  another supported testing framework like `jasmine`.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
