
# 0.0.8

* Updated to use the new element/import form of Polymer (i.e `polymer.html` instead of `polymer.js`). `platform.js` is included as part of `index.html` from Bower
* Integrated support for latest version of `grunt-vulcanize`. `grunt build` will generate `dist/build.html` containing a version of your app with all HTML Imports and most resources inlined.
* Updated how elements are named. We now generate element names of the form `polymer-foo` where `foo` is the name you specify at the prompt. E.g `yo polymer:element sidebar` will create the element `<polymer-sidebar>`
* Templates and dependencies updated to use bootstrap-sass 3.0.0. This comes with a face-lift for `index.html` which brings it more in-line with `generator-webapp`.
* A new prompt is available for the `element` sub-generator offering very basic support for automatically adding/writing up an element installed with Bower. We are hoping to replace this with a solution using `grunt-bower-install` in the future.
* Improved comments for the Polymer element file generated. All life-cycle events are also now included to improve the getting started experience.