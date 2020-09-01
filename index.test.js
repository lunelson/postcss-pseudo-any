/* eslint-disable no-irregular-whitespace */
/* eslint-disable max-len */
let postcss = require('postcss')

let plugin = require('./')

it('converts :any() pseudo-selectors, including badly formed ones', async () => {
  let result = await postcss([plugin()]).process(
    `
a::any(.convert),
a:any(.convert),
::any(.convert),
:any(.convert),
.skip {
  color: red;
}
  `,
    { from: undefined }
  )
  expect(result.css).toMatchInlineSnapshot(`
    "
    a:-moz-any(.convert),
    a:-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert) {
      color: red;
    }
    a:-webkit-any(.convert),
    a:-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert) {
      color: red;
    }
    .skip {
      color: red;
    }
      "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('skips prefixed :any() pseudo-selectors', async () => {
  let result = await postcss([plugin()]).process(
    `
a:any(.convert),
a:-moz-any(.skip),
a:-webkit-any(.skip),
::any(.convert),
::-moz-any(.skip),
::-webkit-any(.skip),
{
  color: red;
}
`,
    { from: undefined }
  )
  expect(result.css).toMatchInlineSnapshot(`
    "
    a:-moz-any(.convert),
    :-moz-any(.convert)
    {
      color: red;
    }
    a:-webkit-any(.convert),
    :-webkit-any(.convert)
    {
      color: red;
    }
    a:-moz-any(.skip),
    a:-webkit-any(.skip),
    ::-moz-any(.skip),
    ::-webkit-any(.skip)
    {
      color: red;
    }
    "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('converts prefixed :any() pseudo-selectors, with option', async () => {
  let result = await postcss([plugin({ matchPrefixed: true })]).process(
    `
a:any(.convert),
a:-moz-any(.convert),
a:-webkit-any(.convert),
::any(.convert),
::-moz-any(.convert),
::-webkit-any(.convert),
.skip,
{
  color: red;
}
  `,
    { from: undefined }
  )
  expect(result.css).toMatchInlineSnapshot(`
    "
    a:-moz-any(.convert),
    a:-moz-any(.convert),
    a:-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert)
    {
      color: red;
    }
    a:-webkit-any(.convert),
    a:-webkit-any(.convert),
    a:-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert)
    {
      color: red;
    }
    .skip
    {
      color: red;
    }
      "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('skips :is() and :matches() pseudo-selectors if option is false', async () => {
  let result = await postcss([plugin({ matchModern: false })]).process(
    `
:is(.skip),
:any(.convert),
:matches(.skip),
::is(.skip),
::any(.convert),
::matches(.skip),
{
  color: yellow
}
  `,
    { from: undefined }
  )
  expect(result.css).toMatchInlineSnapshot(`
    "
    :-moz-any(.convert),
    :-moz-any(.convert)
    {
      color: yellow
    }
    :-webkit-any(.convert),
    :-webkit-any(.convert)
    {
      color: yellow
    }
    :is(.skip),
    :matches(.skip),
    ::is(.skip),
    ::matches(.skip)
    {
      color: yellow
    }
      "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('converts :is() and :matches() pseudo-selectors', async () => {
  let result = await postcss([plugin()]).process(
    `
:is(.convert),
:any(.convert),
:matches(.convert),
::is(.convert),
::any(.convert),
::matches(.convert),
{
  color: yellow
}
  `,
    { from: undefined }
  )
  expect(result.css).toMatchInlineSnapshot(`
    "
    :-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert),
    :-moz-any(.convert)
    {
      color: yellow
    }
    :-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert),
    :-webkit-any(.convert)
    {
      color: yellow
    }
      "
  `)
  expect(result.warnings()).toHaveLength(0)
})

it('matches multiple times within a selector', async () => {
  let result = await postcss([plugin()]).process(
    `
.boop .beep,
.boop > :any(foo, bar, baz) + :any(foo, bar, baz)
{
  color: blue;
}
  `,
    { from: undefined }
  )
  expect(result.css).toMatchInlineSnapshot(`
    "
    .boop > :-moz-any(foo, bar, baz) + :-moz-any(foo, bar, baz)
    {
      color: blue;
    }
    .boop > :-webkit-any(foo, bar, baz) + :-webkit-any(foo, bar, baz)
    {
      color: blue;
    }
    .boop .beep
    {
      color: blue;
    }
      "
  `)
  expect(result.warnings()).toHaveLength(0)
})
