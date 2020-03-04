# postcss-pseudo-any

[![Build Status](https://travis-ci.com/lunelson/postcss-pseudo-any.svg?branch=master)](https://travis-ci.com/lunelson/postcss-pseudo-any)
[![Build Status](https://david-dm.org/lunelson/postcss-pseudo-any.svg?branch=master)](https://travis-ci.com/lunelson/postcss-pseudo-any)

A [PostCSS] plugin for CSS authors who can't wait to use `:matches()` or `:is()`. Converts the `:any()` selector to `:-moz-any()` and `:-webkit-any()`, and lets you get on with things.

## WTF
CSS level 4 contains a spec for `:is()` which was previously called `:matches()`, and previous to that was anticipated to be called `:any()`, and was actually implemented at some point, across most modern browsers in _prefixed_ form as `:-moz-any()` and `:-webkit-any()`.

Those prefixed forms are now considered deprecated (and slightly wrong in terms of specificity), and they lack some features projected for `:is()`; _but the fact remains that no browser currently implements `:is()` or `:matches()`_, while prefixed `:-moz-any()` and `:-webkit-any()` are well-supported.

<p>
<a href="http://caniuse.com/#feat=css-matches-pseudo">
  <picture>
    <source type="image/webp" srcset="https://caniuse.bitsofco.de/static/v1/css-matches-pseudo-1583332286062.webp">
    <img src="https://caniuse.bitsofco.de/static/v1/css-matches-pseudo-1583332286062.png" alt="Data on support for the css-matches-pseudo feature across the major browsers from caniuse.com">
  </picture>
</a>
</p>

## Usage

Basically, start with a declaration using an `:is()`, `:matches()` or :`any()` selector:

```css
.bar,
:is(.good),
:matches(.well),
[class^='base-']:any(a),
:any(p, ul, ol),
.foo {
  color: blue
}
```
This will be cloned and separated out, in to separate declarations with prefixed versions of the `is/matches/any` selectors isolated from any other selectors in that declaration:

```css
:-moz-any(.good), 
:-moz-any(.well), 
[class^='base-']:-moz-any(a), 
:-moz-any(p, ul, ol) { 
  color: blue 
} 
 
:-webkit-any(.good), 
:-webkit-any(.well), 
[class^='base-']:-webkit-any(a), 
:-webkit-any(p, ul, ol) { 
  color: blue 
} 
 
.bar, 
.foo { 
  color: blue 
} 
```

## Plugging it in

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


[official docs]: https://github.com/postcss/postcss#usage
[PostCSS]: https://github.com/postcss/postcss
