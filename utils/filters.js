const markdownItAbbr = require('./markdown-it-abbr.js')
const markdownItAnchor = require('markdown-it-anchor')
const { DateTime } = require('luxon')

module.exports = {

    prepend_page_section: function(title, section) {
      return section ? `${section}/${title}` : title;
    },

    prependAbbreviations: function(string) {
      return "*[DVLA]: Driver and Vehicle Licensing Agency. This is the government organisation responsible for vehicles and driving licenses\n" + string;
    },

    where: function (array, key, value) {
      return array.filter(item => {
        return (item.data.section && (item.data.section === value) ? item : false);
      });
    },

    dateToFormat: function (date, format) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        )
    },

    dateToISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    obfuscate: function (str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    },

    markdown: function (str) {
      const md = require('markdown-it')({
          html: true,
          breaks: true,
          linkify: true
      }).use(markdownItAbbr).use(markdownItAnchor);

      return md.render(str);
    },

    markdownify: function (str) {
      const md = require('markdown-it')({
          html: true,
          breaks: true,
          linkify: true
      });
      return md.renderInline(str);
    }

}
