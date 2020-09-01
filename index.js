/* eslint-disable max-len */
let postcss = require('postcss')

/*
                  _                                               _
                  | |                                             | |
  _ __   ___  ___| |_ ___ ___ ___ ______ _ __  ___  ___ _   _  __| | ___ ______ __ _ _ __  _   _
  | '_ \ / _ \/ __| __/ __/ __/ __|______| '_ \/ __|/ _ \ | | |/ _` |/ _ \______/ _` | '_ \| | | |
  | |_) | (_) \__ \ || (__\__ \__ \      | |_) \__ \  __/ |_| | (_| | (_) |    | (_| | | | | |_| |
  | .__/ \___/|___/\__\___|___/___/      | .__/|___/\___|\__,_|\__,_|\___/      \__,_|_| |_|\__, |
  | |                                    | |                                                 __/ |
  |_|                                    |_|                                                |___/

  This plugin does the following:

  1. It catches instances of :any() selectors within rules, including
      badly formed versions
      --optionally, modern :is() and :matches() versions
      --optionally, already-prefixed :-moz-any() and :-webkit-any() versions
  2. It clones and separates the rule in to ones with prefixed :-moz-any() and :-webkit-any() selectors,
      separate from non-:any() selectors from the original rule.
 */

const postcssPseudoAny = postcss.plugin('postcss-pseudo-any', ({
  matchModern = true,
  matchPrefixed = false
} = {}) => {
  // eslint-disable-next-line security/detect-non-literal-regexp
  let anyRE = new RegExp(`::?(${ matchModern ? 'is|matches|' : '' }${ matchPrefixed ? '(-?(moz|webkit)-)?' : '' }any)\\(`, 'g')
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

module.exports = postcssPseudoAny
