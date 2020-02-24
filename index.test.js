/* eslint-disable no-irregular-whitespace */
/* eslint-disable max-len */
let postcss = require('postcss')

let plugin = require('./')

async function run (input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('catches badly formed or already-prefixed :any() selectors', async () => {
  await run(`
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
`, `
a:-moz-any(.link, .btn), a:-moz-any(.link, .btn), a:-moz-any(.link, .btn), a:-moz-any(.link, .btn), a:-moz-any(.link, .btn), a:-moz-any(.link, .btn), a:-moz-any(.link, .btn), :-moz-any(span), :-moz-any(span), :-moz-any(span), :-moz-any(span), :-moz-any(span), :-moz-any(span), :-moz-any(span) {
  color: red;
}
a:-webkit-any(.link, .btn), a:-webkit-any(.link, .btn), a:-webkit-any(.link, .btn), a:-webkit-any(.link, .btn), a:-webkit-any(.link, .btn), a:-webkit-any(.link, .btn), a:-webkit-any(.link, .btn), :-webkit-any(span), :-webkit-any(span), :-webkit-any(span), :-webkit-any(span), :-webkit-any(span), :-webkit-any(span), :-webkit-any(span) {
  color: red;
}
`, {})
})

it('outputs prefixed :any() selectors in separate cloned rules with non :any() selectors remaining in the original rule', async () => {
  await run(`
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
`, `
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

.moz > :-moz-any(h1, h2, h3),
.moz > :-moz-any(p, ul, ol) {
  margin-top: -1em
}

.moz > :-webkit-any(h1, h2, h3),
.moz > :-webkit-any(p, ul, ol) {
  margin-top: -1em
}

.foobar {
  margin-top: -1em
}
`, {})
})
