
module.exports = {
    dropdown: function (content, title, description, image) {
        return `<details><summary><h3>${ title }</h3><p>${ description }. <u>View list</u>.</p><img alt="Icon for ${title}" src="${image}" /></summary>${ content }</details>`;
    },
    tip: function (content, name, image) {
      const md = require('markdown-it')({
          html: true,
          breaks: true,
          linkify: true
      });
        return `<blockquote class="tip"><img width="50" height="50" alt="Photo of ${ name }" src="${ image }" /><div class="blockquote-text">${ md.render(content) }<p><strong>${ name }</strong></p></div></blockquote>`;
    }
}
