const fs = require('fs')
const htmlmin = require('html-minifier')
const critical = require('critical')
const puppeteer = require('puppeteer')
const buildDir = 'dist'

// Puppeteer 2.x bundles an Intel-only Chromium that won't run on Apple Silicon.
// Probe known system Chrome locations first; fall back to the bundled binary
// (which works fine on Netlify's x86_64 Linux).
function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH
  }
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
    '/usr/bin/google-chrome-stable',  // Linux (Netlify)
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ]
  return candidates.find(p => fs.existsSync(p)) || puppeteer.executablePath()
}

const shouldTransformHTML = (outputPath) =>
  outputPath &&
  outputPath.endsWith('.html') &&
  process.env.ELEVENTY_ENV === 'production'

const isHomePage = (outputPath) => outputPath === `${buildDir}/index.html`

process.setMaxListeners(Infinity)
module.exports = {
  htmlmin: function (content, outputPath) {
    if (shouldTransformHTML(outputPath)) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })
    }
    return content
  },

  critical: async function (content, outputPath) {
    if (shouldTransformHTML(outputPath) && isHomePage(outputPath)) {
      try {
        const { css, html, uncritical } = await critical.generate({
          base: `${buildDir}/`,
          html: content,
          width: 1401,
          height: 900,
          inline: true,
          penthouse: {
            timeout: 90000,
            puppeteer: {
              getBrowser: () => puppeteer.launch({
                executablePath: findChrome(),
                args: ['--no-sandbox', '--disable-setuid-sandbox']
              })
            }
          }
        })
        return html
      } catch (err) {
        console.error(err)
        return content
      }
    } else {
      return content
    }
  }
}
