import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '前端物语',
    items: [
      { text: 'JavaScript 基础知识', link: '/fe/javascript/types' },
      { text: 'CSS 理论知识点', link: '/fe/css/' },
      { text: 'ES6 常用知识', link: '/fe/es6/' },
      {
        items: [
          { text: 'TypeScript 基础知识', link: '/fe/typescript/base' },
          { text: 'TypeScript 工具类型', link: '/fe/typescript/utility-types' },
          { text: 'TypeScript 编译配置', link: '/fe/typescript/tsconfig' },
          { text: 'TypeScript 类型体操', link: '/fe/typescript/challenges' },
        ],
      },
      {
        items: [
          { text: 'Monorepo', link: '/fe/monorepo/' },
          { text: 'Rollup', link: '/fe/rollup/' },
          { text: 'Webpack 理论知识', link: '/fe/webpack/' },
    
        ]
      },
      { text: '浏览器', link: '/fe/browser/' },
      { text: '编程题', link: '/fe/coding/' },
    ],
    activeMatch: '^/fe',
  },
  {
    text: '源码阅读',
    items: [
      { text: 'React 18.2.0', link: '/analysis/react/18.2.0/base/idea' },
      {
        text: 'Vue',
        link: '/analysis/vue/way'
      },
      {
        text:'CLI',
        items: [
          {
            text: 'create-vue',
            link: '/analysis/cli/create-vue'
          }
        ]
      },
      {
        text: 'Utils',
        items: [
          { text: 'only-allow', link: '/analysis/utils/only-allow' },
          { text: 'clsx', link: '/analysis/utils/clsx' },
          { text: 'await-to-js', link: '/analysis/utils/await-to-js' },
        ],
      },
    ],
  },
  {
    text: 'Workflow',
    items: [
      {
        text: '编程规范',
        link: '/workflow/style-guide',
      },
      {
        // text: '常用工具/方法',
        items: [
          { text: '常用正则整理', link: '/workflow/utils/regexp' },
          { text: '常用代码片段', link: '/workflow/utils/snippets' },
        ],
      },
      {
        //   text: 'CSS 相关',
        items: [
          { text: 'HTML 语法', link: '/workflow/html/tricks' },
          { text: 'CSS 语法', link: '/workflow/css/spec' },
          { text: 'CSS 奇淫技巧', link: '/workflow/css/tricks' },
          { text: 'Sass 常用技巧', link: '/workflow/sass/' },
        ],
      },
      {
        text: 'Tailwind CSS 使用与配置',
        link: '/workflow/library/tailwindcss',
      },
      {
        text: '文字特效',
        link: '/workflow/layout/effects/text',
      },
      {
        text: 'Vue 小技巧',
        link: '/workflow/vue/',
      },
      { text: 'npm 常用命令', link: '/workflow/node/npm' },
      {
        //   text: '终端相关',
        items: [
          { text: 'Zsh 配置', link: '/workflow/terminal/zsh' },
          { text: '命令行工具', link: '/workflow/terminal/toolkit' },
          { text: 'Shell 命令', link: '/workflow/terminal/shell' },
        ],
      },
      { text: 'Git 相关技巧', link: '/workflow/git/' },
      { text: 'Git 命令清单', link: '/workflow/git/command' },
      {
        items: [
          { text: 'chrome debugger', link: '/workflow/chrome/debugger' },
          { text: 'chrome插件', link: '/workflow/chrome/plugins' },
        ],
      },
    ],
    activeMatch: '^/workflow',
  },
  {
    text: '笔记',
    items: [
      { text: '日常笔记', link: '/daily-notes/', activeMatch: '^/daily-notes' },
      {
        text: '踩坑记录',
        items: [
          { text: 'JavaScript 踩坑记录', link: '/pit/javascript' },
          { text: 'TypeScript 踩坑记录', link: '/pit/typescript' },
          { text: 'CSS 踩坑记录', link: '/pit/css' },
          { text: 'Npm 踩坑记录', link: '/pit/npm' },
          { text: '第三方库踩坑记录', link: '/pit/library' },
          { text: 'PC 踩坑记录', link: '/pit/pc' },
          { text: 'H5 踩坑记录', link: '/pit/h5' },
          { text: '微信开发踩坑记录', link: '/pit/wechat' },
          { text: '浏览器踩坑记录', link: '/pit/browser' },
          { text: '编辑器踩坑记录', link: '/pit/editor' },
          { text: 'Uniapp 踩坑记录', link: '/pit/uniapp' },
          { text: 'Vue 踩坑记录', link: '/pit/vue' },
        ],
      },
    ],
    activeMatch: '^/daily-notes|pit'
  },
  {
    text: '提效工具',
    items: [
      {
        text: '软件推荐与配置',
        items: [
          { text: '多平台软件', link: '/efficiency/software/cross-platform' },
          { text: 'Mac 平台', link: '/efficiency/software/mac' },
          { text: 'Windows 平台', link: '/efficiency/software/windows' },
          { text: 'Android 平台', link: '/efficiency/software/android' },
          { text: '浏览器设置与扩展', link: '/efficiency/software/browser' },
          { text: 'Visual Studio Code 配置', link: '/efficiency/software/vscode' },
          { text: 'WebStorm 配置', link: '/efficiency/software/webstorm' },
        ],
      },
      { text: '在线工具', link: '/efficiency/online-tools' },
      { text: '书签脚本', link: '/efficiency/bookmark-scripts' },
    ],
    activeMatch: '^/efficiency',
  },
  {
    text: '濑户',
    link: '/wild'
  }
]
