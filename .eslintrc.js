module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
    // "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    // vue
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 4 },
        multiline: { max: 1 }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-indent': ['error', 2],
    'vue/script-indent': ['error', 2],
    'vue/html-self-closing': 0,
    // 'vue/html-quotes': ['error', 'single'],
    'vue/multi-word-component-names': ['off'],
    // js
    quotes: ['error', 'single'], // 单引号，其他类型报错
    indent: ['error', 2], // 2 行缩进
    semi: ['error', 'never'], // 禁止使用分号
    'no-debugger': 'warn', // 使用 debugger 会警告
    'no-else-return': 'error', // 如果 if 语句里面有 return ,后面不能跟 else 语句
    'space-infix-ops': ['error', { int32Hint: false }], // 要求操作符周围有空格
    'no-multi-spaces': 'error', // 禁止多个空格
    'no-multiple-empty-lines': ['error', { max: 2 }], // 空行最多不能超过2行
    'no-whitespace-before-property': 'error', // 禁止在属性前使用空格
    'space-before-blocks': 'error', // 在块之前强制保持一致的间距
    'no-trailing-spaces': 'error', // 一行结束后面不要有空格
    'space-before-function-paren': ['error', 'never'], // 在“ function”定义打开括号之前强制不加空格
    'space-in-parens': ['error', 'never'], // 强制括号左右的不加空格
    'spaced-comment': ['error', 'always'], // 注释间隔
    'template-tag-spacing': ['error', 'always'], // 在模板标签及其文字之间需要空格
    'no-var': 'error', // 禁止使用 var
    'prefer-destructuring': [
      'error',
      {
        // 优先使用数组和对象解构
        array: false,
        object: false
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    // 组件名称为多个单词，忽略的组件名称
    'comma-dangle': ['error', 'never'], // 最后一个属性不允许有逗号
    'arrow-spacing': 'error', // 箭头函数空格
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'quote-props': ['error', 'as-needed'], // 对象字面量属性名称使用引号
    'object-curly-spacing': ['error', 'always'], // 强制在花括号中使用一致的空格
    'no-unneeded-ternary': 'error', // 禁止可以表达为更简单结构的三元操作符
    'no-restricted-syntax': [
      'error',
      'WithStatement',
      'BinaryExpression[operator="in"]'
    ], // 禁止with/in语句
    'no-lonely-if': 'error', // 禁止 if 语句作为唯一语句出现在 else 语句块中
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }], // 要求方法链中每个调用都有一个换行符
    // 路径别名设置
    'no-submodule-imports': ['off', '/@'],
    'no-implicit-dependencies': ['off', ['/@']]
    // typescript
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
