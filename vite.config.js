import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Repo Radar',
        short_name: 'RepoRadar',
        description: 'GitHub repository explorer',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})