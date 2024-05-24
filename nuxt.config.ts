// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui",'@vueuse/nuxt',],  
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
});
