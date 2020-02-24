// eslint-disable-next-line security/detect-unsafe-regex
const anyRE = /::?(-?(moz|webkit)-)?any\(/iu;

// [
//   '.foo',
//   ':any(),
//   ':-moz-any()',
//   ':-webkit-any()',
//   '::any()',
//   '::-moz-any()',
//   '::-webkit-any()',
//   ':moz-any()',
//   ':webkit-any()'
// ].map(str => str.match(anyRE));

[
  '.foo',
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
