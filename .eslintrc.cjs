module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest' // Habilita await na root
  },
  env: {
    browser: true,
    node: true
  },
  // parserOptions: {
  //   parser: 'babel-eslint'
  // },
  extends: [
    'standard',
    '@nuxt/eslint-config', // Habilita useFetch e outras metodos do nuxt
    'plugin:vue/vue3-essential'
    // 'plugin:vue/vue3-recommended',
    // 'plugin:vue/vue3-strongly-recommended'
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    // Problema ao tentar criar componente index
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3
      },
      multiline: {
        max: 1
      }
    }]
  }
}
