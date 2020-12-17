const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItAbbr = require('markdown-it-abbr')
const pluginTOC = require('eleventy-plugin-toc')
const pluginSrcsetImg = require('eleventy-plugin-srcset')

const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')
const shortcodes = require('./utils/shortcodes.js')
const iconsprite = require('./utils/iconsprite.js')

module.exports = function (config) {
    // Plugins
    config.addPlugin(pluginRss)
    config.addPlugin(pluginNavigation)
    config.addPlugin( pluginSrcsetImg, {})
    config.addPlugin(pluginTOC, {
      tags: ['h2'],
      wrapper: 'div'
    })

    // Filters
    Object.keys(filters).forEach((filterName) => {
        config.addFilter(filterName, filters[filterName])
    })

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        config.addTransform(transformName, transforms[transformName])
    })

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        config.addShortcode(shortcodeName, shortcodes[shortcodeName])
    })

    // Icon Sprite
    config.addNunjucksAsyncShortcode('iconsprite', iconsprite)

    // Asset Watch Targets
    config.addWatchTarget('./src/assets')

    // Markdown
    config.setLibrary(
        'md',
        markdownIt({
            html: true,
            breaks: true,
            linkify: true,
            typographer: true
        }).use(markdownItAbbr).use(markdownItAnchor)
    )

    // Collections
    config.addCollection('pages', collection => {
      return collection.getFilteredByGlob('src/pages/*.njk')
        .sort(function(a, b) {
          return Math.sign(a.data.order - b.data.order);
        });
    });

    config.addCollection('sections', collection => {
      return collection.getFilteredByGlob('src/sections/*.*');
    });

    // Layouts
    config.addLayoutAlias('base', 'base.njk')
    config.addLayoutAlias('post', 'post.njk')
    config.addLayoutAlias('page', 'page.njk')
    config.addLayoutAlias('section', 'section.njk')

    // Pass-through files
    config.addPassthroughCopy('src/robots.txt')
    config.addPassthroughCopy('src/site.webmanifest')
    config.addPassthroughCopy('src/assets/images')
    config.addPassthroughCopy('src/assets/fonts')

    // Deep-Merge
    config.setDataDeepMerge(true)

    // Base Config
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
            data: 'data'
        },
        templateFormats: ['njk', 'md', '11ty.js'],
        // htmlTemplateEngine: 'njk'
        markdownTemplateEngine: 'njk'
    }
}
