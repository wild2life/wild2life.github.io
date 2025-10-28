import type { DefaultTheme } from 'vitepress'
import fs from 'fs-extra'

const sidebarDailyNotes: DefaultTheme.SidebarItem[] =
  fs.readJSONSync('./scripts/daily-notes.json', { throws: false }) || []

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/fe/': [
    {
      text: 'JavaScript 基础知识',
      collapsed: false,
      items: [
        { text: '数据类型', link: '/fe/javascript/types' },
        { text: '引用类型的拷贝', link: '/fe/javascript/clone' },
        { text: '类型转换', link: '/fe/javascript/conversions' },
        { text: '原型和原型链', link: '/fe/javascript/prototype' },
        { text: '继承', link: '/fe/javascript/inherit' },
        { text: 'this', link: '/fe/javascript/this' }
      ]
    },
    {
      text: 'ES6 常用知识点',
      link: '/fe/es6/'
    },
    {
      text: 'TypeScript',
      collapsed: false,
      items: [
        { text: '基础知识', link: '/fe/typescript/base' },
        { text: '工具类型', link: '/fe/typescript/utility-types' },
        { text: '三斜线指令', link: '/fe/typescript/triple-slash-directives' },
        { text: '编译配置', link: '/fe/typescript/tsconfig' },
        { text: '类型体操', link: '/fe/typescript/challenges' }
      ],
      link: '/fe/typescript/base'
    },
    {
      text: 'HTML / CSS',
      collapsed: false,
      items: [
        { text: 'HTML 理论知识点', link: '/fe/html/' },
        { text: 'CSS 理论知识点', link: '/fe/css/' }
      ]
    },
    {text: '工程化', items: [
      { text: ' Monorepo', link: '/fe/monorepo/' },
      { text: ' Rollup', link: '/fe/rollup/' },
      { text: ' Webpack', link: '/fe/webpack/' },
    ]},
   
    {
      text: '浏览器与网络',
      collapsed: false,
      items: [
        { text: '浏览器相关知识点', link: '/fe/browser/' },
        { text: 'TCP', link: '/fe/network/tcp' },
        { text: 'HTTP', link: '/fe/network/http' }
      ]
    },
    {
      text: 'Node',
      collapsed: false,
      items: [{ text: 'package.json', link: '/fe/node/pkg' }]
    },
    {
      text: '概念知识点',
      collapsed: false,
      items: [
        { text: '模块化', link: '/fe/concept/module' },
        { text: '前端页面渲染方式', link: '/fe/concept/page-rendering' }
      ]
    },
    {
      text: '编程题',
      link: '/fe/coding/'
    }
  ],
  '/analysis/': [
    {
      text: 'React',
      items: [
        { text: 'React 18 的新特性', link: '/analysis/react/18' },
        { text: 'React-18.2.0 源码解析', 
          items: [
            { text: '基础知识',
              items: [
              {
                text: 'React 设计理念与架构',
                link: '/analysis/react/18.2.0/base/idea'
              },
              {
                text: 'Fiber 架构和双缓存',
                link: '/analysis/react/18.2.0/base/fiber'
              },
              {
                text: '源码文件结构',
                link: '/analysis/react/18.2.0/base/file'
              },

              {
                text: '启动模式和渲染流程',
                link: '/analysis/react/18.2.0/base/mode-process'
              },
              {
                text: 'Virtual DOM',
                link: '/analysis/react/18.2.0/base/virtual-dom'
              },
              {
                text: 'JSX',
                link: '/analysis/react/18.2.0/base/jsx'
              }
            ] },
            { text: '渲染流程', items: [
              {
                text: '初始化阶段',
                link: '/analysis/react/18.2.0/process/init'
              },
              {
                text: 'render 阶段',
                items: [
                  {
                    text: 'schedule-update-on-fiber',
                    link: '/analysis/react/18.2.0/process/schedule-update-on-fiber'
                  },
                  {
                    text: 'begin-work',
                    link: '/analysis/react/18.2.0/process/begin-work'
                  },
                  {
                    text: 'complete-work',
                    link: '/analysis/react/18.2.0/process/complete-work'
                  }
                ]
              },
              {
                text: 'commit 阶段',
                items: [
                  {
                    text: 'commit-root',
                    link: '/analysis/react/18.2.0/process/commit-root'
                  },
                  {
                    text: 'before mutation 阶段',
                    link: '/analysis/react/18.2.0/process/commit-before-mutation-effects'
                  },
                  {
                    text: 'mutation 阶段',
                    link: '/analysis/react/18.2.0/process/commit-mutation-effects'
                  },
                  {
                    text: 'layout 阶段',
                    link: '/analysis/react/18.2.0/process/commit-layout-effects'
                  }
                ]
              }
            ] },
          ]
        },
        { text: 'React 常见面试题', link: '/analysis/react/interview' }
      ]
    },
    { text: 'Vue', items: [
      { text: '源码阅读技巧', link: '/analysis/vue/way' },
      { text: 'Vue常见面试题', link: '/analysis/vue/interview' }
  ]
   },
    {
      text: '工具库',
      // collapsed: false,
      items: [
        { text: 'only-allow', link: '/analysis/utils/only-allow' },
        { text: 'clsx', link: '/analysis/utils/clsx' },
        { text: 'await-to-js', link: '/analysis/utils/await-to-js' }
      ]
    }
  ],
  '/workflow/': [
    {
      text: '编程规范',
      link: '/workflow/style-guide'
    },
    {
      text: '开发小技巧',
      link: '/workflow/tricks/index'
    },
    {
      text: '常用工具/方法',
      collapsed: false,
      items: [
        { text: '工具库整理', link: '/workflow/utils/library' },
        { text: '常用正则整理', link: '/workflow/utils/regexp' },
        { text: '常用代码片段', link: '/workflow/utils/snippets' }
      ]
    },
    {
      text: '常用库的使用与配置',
      collapsed: false,
      items: [
        { text: 'Tailwind CSS', link: '/workflow/library/tailwindcss' },
        { text: 'Day.js', link: '/workflow/library/dayjs' }
      ]
    },
    {
      text: 'HTML / CSS 相关',
      collapsed: false,
      items: [
        { text: 'HTML 奇淫技巧', link: '/workflow/html/tricks' },
        { text: 'CSS 语法', link: '/workflow/css/spec' },
        { text: 'CSS 奇淫技巧', link: '/workflow/css/tricks' },
        { text: 'Sass 常用技巧', link: '/workflow/sass/' }
      ]
    },
    {
      text: '布局与样式',
      collapsed: false,
      items: [
        { text: '边框', link: '/workflow/layout/border' },
        { text: '进度条', link: '/workflow/layout/progress' },
        { text: '文字特效', link: '/workflow/layout/effects/text' }
      ] 
    },
    {
      text: 'Vue 相关',
      link: '/workflow/vue/'
    },
    {
      text: 'Node 相关',
      // collapsed: false,
      items: [{ text: 'npm 常用命令', link: '/workflow/node/npm' }]
    },
    {
      text: '终端相关',
      collapsed: false,
      items: [
        { text: 'Zsh 配置', link: '/workflow/terminal/zsh' },
        { text: '命令行工具', link: '/workflow/terminal/toolkit' },
        { text: 'Shell 命令', link: '/workflow/terminal/shell' }
      ]
    },
    {
      text: 'Git 相关',
      collapsed: false,
      items: [
        { text: 'Git 相关技巧', link: '/workflow/git/' },
        { text: 'Git 命令清单', link: '/workflow/git/command' }
      ]
    },
    {
      text: 'Chrome',
      collapsed: false,
      items: [
        { text: 'chrome debugger', link: '/workflow/chrome/debugger' },
        { text: 'chrome插件', link: '/workflow/chrome/plugins' }
      ]
    }
  ],
  '/efficiency/': [
    {
      text: '软件推荐与配置',
      // collapsed: false,
      items: [
        { text: '多平台软件', link: '/efficiency/software/cross-platform' },
        { text: 'Mac 平台', link: '/efficiency/software/mac' },
        { text: 'Windows 平台', link: '/efficiency/software/windows' },
        { text: 'Android 平台', link: '/efficiency/software/android' },
        { text: '浏览器设置与扩展', link: '/efficiency/software/browser' },
        { text: 'Visual Studio Code 配置', link: '/efficiency/software/vscode' },
        { text: 'WebStorm 配置', link: '/efficiency/software/webstorm' }
      ]
    },
    { text: '在线工具', link: '/efficiency/online-tools' },
    { text: '书签脚本', link: '/efficiency/bookmark-scripts' }
  ],
  '/pit/': [
    {
      text: '踩坑记录',
      // collapsed: false,
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
      ]
    },
  ],
  '/daily-notes': sidebarDailyNotes
}
