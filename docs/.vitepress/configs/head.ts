import type { HeadConfig } from 'vitepress'

const base = '/';

export const head: HeadConfig[] = [
  ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  
  // 修正路径，添加 favicon/ 前缀
  ['link', { rel: 'icon', type: 'image/x-icon', href: `${base}favicon/favicon.ico` }],
  ['link', { rel: 'shortcut icon', href: `${base}favicon/favicon.ico` }],
  
  // 为不同尺寸提供对应的图标
  ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${base}favicon/favicon-16x16.png` }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}favicon/favicon-32x32.png` }],
  
  // Apple Touch Icon
  ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}favicon/apple-touch-icon.png` }],
  
  // Android Chrome Icons
  ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${base}favicon/android-chrome-192x192.png` }],
  ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: `${base}favicon/android-chrome-512x512.png` }],
  
  // Web App Manifest
  ['link', { rel: 'manifest', href:  `${base}favicon/site.webmanifest` }],
  
  // Mask Icon (Safari pinned tab)
  ['link', { rel: 'mask-icon', href: `${base}favicon/favicon.ico`, color: '#3eaf7c' }],
  
  // Microsoft配置
  ['meta', { name: 'msapplication-TileImage', content: `${base}favicon/favicon.ico` }],
  ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
  // ['meta', { name: 'msapplication-config', content: '/browserconfig.xml' }] // 如果有的话
]
