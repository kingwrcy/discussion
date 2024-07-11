import antfu from '@antfu/eslint-config'

export default antfu({

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },
  rules: {
    'node/prefer-global/process': ['off'],
    'no-console': 'off',
    'import/no-named-default': 'off',
    'vue/valid-v-slot': 'off',
  },
})
