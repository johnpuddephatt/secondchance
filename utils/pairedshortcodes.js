module.exports = {
    dropdown: function (content, title, description, image) {
        return `<details>
<summary>
<h3>${ title }</h3>
<p>${ description }. <u>View list</u>.</p>
<img alt="Icon for ${title}" src="${image}" />
</summary>
${ content }
</details>`;
    }
}
