module.exports = {
    icon: function (name, className, width, height) {
        return `<svg class="icon icon--${name} ${className}" role="img" aria-hidden="true" width="${ width || 24 }" height="${ height || 24 }">
                    <use xlink:href="#icon-${name}"></use>
                </svg>`
    }
}
