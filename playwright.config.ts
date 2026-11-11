import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4173/flex/', launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } },
  webServer: { command: 'python3 tests/serve.py', url: 'http://127.0.0.1:4173/flex/main/', reuseExistingServer: false },
})
