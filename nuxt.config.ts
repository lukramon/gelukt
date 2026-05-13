import { readFileSync } from 'fs'
import { resolve } from 'path'

let versie = '1.0.0'
try {
  const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8')) as { version: string }
  versie = pkg.version
} catch {}

export default defineNuxtConfig({
  runtimeConfig: {
    public: { versie },
  },
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'nl' },
      meta: [
        { name: 'theme-color', content: '#F8F6F2' },
        { name: 'robots', content: 'index, follow' },
      ],
      // Thema direct instellen vóór rendering — voorkomt flash + zorgt dat
      // het intro-scherm meteen de juiste achtergrond/tekst heeft
      script: [{
        innerHTML: `try{const s=localStorage.getItem('gelukt-donker');const d=s!==null?s==='true':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}`,
        type: 'text/javascript',
      }],
      link: [
        { rel: 'canonical', href: 'https://gelukt.be' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Lusitana:wght@400;700&display=swap' },
      ],
    },
  },

  typescript: { strict: true },
  compatibilityDate: '2024-11-01',
})
