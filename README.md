# postcss-pseudo-any

[![Build Status](https://travis-ci.com/lunelson/postcss-pseudo-any.svg?branch=master)](https://travis-ci.com/lunelson/postcss-pseudo-any)
[![Build Status](https://david-dm.org/lunelson/postcss-pseudo-any.svg?branch=master)](https://travis-ci.com/lunelson/postcss-pseudo-any)

A [PostCSS] plugin for CSS authors who can't wait to use `:matches()` or `:is()`. Converts the `:any()` selector to `:-moz-any()` and `:-webkit-any()`, and lets you get on with things.

## WTF
CSS level 4 contains a spec for `:is()` which was previously called `:matches()`, and previous to that was anticipated to be called `:any()`, and was actually implemented across most modern browsers in _prefixed_ form as `:-moz-any()` and `:-webkit-any()`.

Those prefixed forms are now considered _deprecated_ (and slightly incorrect in terms of specificity), and they lack some features projected for `:is()`; but the fact remains, that no browser currently implements `:is()` or `:matches()` but `:any()` is well-supported in those prefixed forms.

<p>
<a href="http://caniuse.com/#feat=css-matches-pseudo">
  <picture>
    <source type="image/webp" srcset="https://caniuse.bitsofco.de/static/v1/css-matches-pseudo-1583332286062.webp">
    <img src="https://caniuse.bitsofco.de/static/v1/css-matches-pseudo-1583332286062.png" alt="Data on support for the css-matches-pseudo feature across the major browsers from caniuse.com">
  </picture>
</a>
</p>

## Installation

Check your project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-pseudo-any'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs] and set this plugin in settings.

## Usage

Basically, this explains itself:

```css
.bar,
[class^='base-']:any(a),
:any(p, ul, ol),
.foo {
  color: blue
}
```

```css
[class^='base-']:-moz-any(a),
:-moz-any(p, ul, ol) {
  color: blue
}

[class^='base-']:-webkit-any(a),
:-webkit-any(p, ul, ol) {
  color: blue
}

.bar,
.foo {
  color: blue
}
```

[official docs]: https://github.com/postcss/postcss#usage
[PostCSS]: https://github.com/postcss/postcss
