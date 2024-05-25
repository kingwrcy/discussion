import { createRequire } from "module";





const prismaClientPath = createRequire(import.meta.url).resolve("@prisma/client");
import dayjs from "dayjs";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui",'@vueuse/nuxt','nuxt-scheduler'],  
  ui: {
    icons: ["carbon"],
  },

  devtools: {
    enabled: false,
  },
  runtimeConfig: {
    public: {
      tokenKey: "",
      avatarCdn: "",
    },
    jwtSecretKey: "",
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser": prismaClientPath.replace("@prisma/client/default.js", ".prisma/client/index-browser.js"),
      },
    },
  },

});
