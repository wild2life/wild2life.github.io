import { basename } from 'node:path'
import { defineConfig } from 'vitepress'
import MarkdownPreview from 'vite-plugin-markdown-preview'

import { head, nav, sidebar, algolia } from './configs'
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  outDir: '../dist',
  base: '/',

  lang: 'zh-CN',
  title: '濑户',
  description: '我的理想永不坠落',
  head,
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: 'localhostLinks',

  /* markdown 配置 */
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },

  /* 主题配置 */
  themeConfig: {
    i18nRouting: false,

    logo: '/logo.jpg',

    nav,
    sidebar,

    /* 右侧大纲配置 */
    outline: {
      level: 'deep',
      label: '目录',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/wild2life' }],

    footer: {
      message: '转载或 CV 自 maomao1996',
      copyright: 'Copyright © 2019-present maomao',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    algolia,
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    /*** 自定义配置 ***/
    visitor: {
      badgeId: 'wild2life.blog',
    },

    comment: {
      repo: 'wild2life/blog',
      repoId: 'R_kgDONb9-0Q',
      category: 'Announcements',
      categoryId: 'DIC_kwDONb9-0c4ClH5X',
    },
  },

  /* 生成站点地图 */
  sitemap: {
    hostname: 'https://wild2life.github.io/',
  },

  vite: {
    plugins: [MarkdownPreview()],
     css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
})
