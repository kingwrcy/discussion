// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["dayjs-nuxt", "@nuxt/ui"],
  dayjs: {
    locales: ["zh-CN"],
    plugins: ["relativeTime"],
    defaultLocale: "zh-CN",
  },
  ui: {
    icons: ["carbon"],
  },

  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    public: {
      tokenKey: "",
      avatarCdn: "",
    },
    jwtSecretKey: "",
  },
});
