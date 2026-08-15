import vuetify from 'eslint-config-vuetify'
// Importing the eslint-plugin-vue-pug package itself eagerly loads its whole
// `lib/configs/*` tree, which resolves `vue-eslint-parser` in a way that Yarn PnP
// rejects. Importing just the two rules we need sidesteps that entirely.
import noParsingError from 'eslint-plugin-vue-pug/lib/rules/no-parsing-error.js'
import noPugControlFlow from 'eslint-plugin-vue-pug/lib/rules/no-pug-control-flow.js'

export default vuetify().then(config => [
  ...config,
  {
    files: ['**/*.vue'],
    plugins: {
      'vue-pug': {
        rules: {
          'no-parsing-error': noParsingError,
          'no-pug-control-flow': noPugControlFlow,
        },
      },
    },
    languageOptions: {
      parserOptions: {
        templateTokenizer: { pug: 'vue-eslint-parser-template-tokenizer-pug' },
      },
    },
    rules: {
      'vue-pug/no-parsing-error': 'error',
      'vue-pug/no-pug-control-flow': 'warn',
    },
  },
])
