# PostCSS Any

[PostCSS] plugin which converts :any selector to the dodgy but still supported :-moz-any and :-webkit-any.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-any'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs] and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

## REFERENCES

https://github.com/csstools/postcss-preset-env
https://webdesign.tutsplus.com/tutorials/postcss-deep-dive-create-your-own-plugin--cms-24605
https://github.com/postcss/postcss-plugin-boilerplate
