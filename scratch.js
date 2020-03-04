/* eslint-disable max-len */

/*

https://github.com/csstools/postcss-preset-env
https://webdesign.tutsplus.com/tutorials/postcss-deep-dive-create-your-own-plugin--cms-24605
https://github.com/postcss/postcss-plugin-boilerplate

TODO:

- change name to postcss-pseudo-any
- add support for :is and :matches, optional, default false
- make the prefixing of existing prefixes also an option, default false

  https://css-tricks.com/almanac/selectors/i/is/
  https://caniuse.com/#feat=css-matches-pseudo
  https://caniuse.com/#feat=mdn-css_selectors_is
  https://bugzilla.mozilla.org/show_bug.cgi?id=906353
  https://developer.mozilla.org/en-US/docs/Web/CSS/:is

 */

let matchIsMatches = false
let matchPrefixed = false
// eslint-disable-next-line security/detect-unsafe-regex
// eslint-disable-next-line security/detect-non-literal-regexp
const anyRE = new RegExp(`::?(${ matchIsMatches ? 'is|matches|' : '' }${ matchPrefixed ? '(-?(moz|webkit)-)?' : '' }any)\\(`);
// const anyRE = /::?(any)\(/iu;
// const anyRE = /::?(is|matches|any)\(/iu;
// const anyRE = /::?(is|matches|(-?(moz|webkit)-)?any)\(/iu;

[
  '.foo',
  ':is()',
  ':matches()',
  ':any()',
  ':-moz-any()',
  ':-webkit-any()',
  '::any()',
  '::-moz-any()',
  '.foo',
  '::-webkit-any()',
  ':moz-any()',
  ':webkit-any()'
].map(str => str.replace(anyRE, ':any(')) // ?

const postcss = require('postcss')

const postcssAny = require('./')

const input = `

/*
  output prefixed :any() selectors in separate cloned rules
  output non-:any() selectors alone in the original rule
 */

/*
  catch badly formed or already-prefixed :any() selectors
 */

a:-moz-any(.link, .btn),
a:-webkit-any(.link, .btn),
a::any(.link, .btn),
a::-moz-any(.link, .btn),
a::-webkit-any(.link, .btn),
a:moz-any(.link, .btn),
a:webkit-any(.link, .btn),
:-moz-any(span),
:-webkit-any(span),
::any(span),
::-moz-any(span),
::-webkit-any(span),
:moz-any(span),
:webkit-any(span) {
  color: red;
}

/*
  output prefixed :any() selectors in separate cloned rules
  output non-:any() selectors alone in the original rule
 */

.bar,
*:is(💩),
:matches(🔥),
[class^='base-']:any(a),
:any(p, ul, ol),
.foo {
  color: blue
}

.foobar,
.moz > :-moz-any(h1, h2, h3),
.moz > :-moz-any(p, ul, ol) {
  margin-top: -1em
}

`;

(async function test () {
  let result = await postcss([postcssAny()]).process(input, { from: undefined })
  // eslint-disable-next-line no-unused-expressions
  result.css // ?
})()
