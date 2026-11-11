export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@element-plus/nuxt'],
  css: ['element-plus/theme-chalk/dark/css-vars.css', '~/assets/css/main.css'],
  app: {
    head: { title: 'ETS — Общение', htmlAttrs: { lang: 'ru' }, meta: [{ name: 'description', content: 'ETS — пространство для общения вашей команды.' }] },
  },
  nitro: { prerender: { routes: ['/', '/main'] } },
})
