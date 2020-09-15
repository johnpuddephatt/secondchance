const htmlmin = require('html-minifier')
const critical = require('critical')
const buildDir = 'dist'

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
            const {css, html, uncritical} = await critical.generate({
              base: `${buildDir}/`,
              html: content,
              width: 1300,
              height: 900,
              inline: true
            });
            return html;
          } catch (err) {
            console.error(err);
          }
        }
        else {
          return content;
        }
    }
}
