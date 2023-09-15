/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "no-debugger": "off"
  },
  overrides: [
    {
      "files": ["src/**/index.vue"], // 匹配views和二级目录中的index.vue
      "rules": {
        "vue/multi-word-component-names": "off"
      } //给上面匹配的文件指定规则
    }
  ]
}
