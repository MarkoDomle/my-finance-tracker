import { defineConfig } from 'playwright'

export default defineConfig({
  testDir: './tests',
  use: {
    browserName: 'chromium',
    headless: false,
  },
})
