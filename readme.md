# A Yeoman generator for Polymer projects.

## Usage

Install: `npm install -g generator-polymer`

Make a new directory and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo polymer`, optionally passing an app name:
```
yo polymer [app-name]
yo polymer:element carousel
yo polymer:custom-element gallery
```


## Generators

Available generators:

- polymer:element
- polymer:app
- polymer:custom-element


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
