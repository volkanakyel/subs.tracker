import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  modules: ['@vueuse/motion/nuxt', 'nuxt-charts'],

  devtools: { enabled: false },

  compatibilityDate: '2025-01-15',

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  app: {
    head: {
      meta: [{ name: 'theme-color', content: '#d8d5cd' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=PT+Mono&display=swap',
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
