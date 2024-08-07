import { createRequire } from 'node:module'

const prismaClientPath = createRequire(import.meta.url).resolve('@prisma/client')
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    storageKey: 'vueuse-color-scheme',
  },

  modules: ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-scheduler'],

  ui: {
    icons: ['carbon'],
  },

  devtools: {
    enabled: false,
  },

  runtimeConfig: {
    public: {
      tokenKey: '',
      avatarCdn: '',
      cookieSecure: false,
    },
    jwtSecretKey: '',
    uploadDir: '/app/upload',
  },

  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': prismaClientPath.replace('@prisma/client/default.js', '.prisma/client/index-browser.js'),
      },
    },
  },
  compatibilityDate: '2024-07-11',
})
