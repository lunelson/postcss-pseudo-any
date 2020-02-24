let postcss = require('postcss')

/*
                   _
                  | |
   _ __   ___  ___| |_ ___ ___ ___ ______ __ _ _ __  _   _
  | '_ \ / _ \/ __| __/ __/ __/ __|______/ _` | '_ \| | | |
  | |_) | (_) \__ \ || (__\__ \__ \     | (_| | | | | |_| |
  | .__/ \___/|___/\__\___|___/___/      \__,_|_| |_|\__, |
  | |                                                 __/ |
  |_|                                                |___/

  This plugin does the following:

  1. It catches various forms of :any() selector,
      includding badly formed or already-prefixed versions.
  2. It separates them in to their own prefixed rules,
      separate from one another, and separate from any
      non-:any() selectors from the same original rule.
 */

/*
  NB: the regex below is marked by eslint as unsafe
  but I'm considering it a false-positive -- see below
  https://github.com/sindresorhus/eslint-plugin-unicorn/issues/153
 */

// eslint-disable-next-line security/detect-unsafe-regex
const anyRE = /::?(-?(moz|webkit)-)?any\(/iu

const postcssAny = postcss.plugin('postcss-any', () => {
  return root => {
    root.walkRules(rule => {
      if (rule.selector.match(anyRE)) {
        let mozRule = rule.cloneBefore()
        let webkitRule = rule.cloneBefore()
        let mozSelectors = []
        let webkitSelectors = []
        rule.selectors = rule.selectors.reduce((arr, sel) => {
          if (sel.match(anyRE)) {
            mozSelectors.push(sel.replace(anyRE, ':-moz-any('))
            webkitSelectors.push(sel.replace(anyRE, ':-webkit-any('))
          } else if (sel.length > 0) {
            arr.push(sel)
          }
          return arr
        }, [])
        mozRule.selectors = mozSelectors
        webkitRule.selectors = webkitSelectors
        if (rule.selectors.length === 1 && rule.selectors[0] === '') {
          rule.remove()
        }
      }
    })
  }
})

module.exports = postcssAny
