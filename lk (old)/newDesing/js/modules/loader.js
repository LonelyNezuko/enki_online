const loader =
{
    append: (element, data = {}) =>
    {
        loader.remove(element)

        if(!data.size) data.size = 60
        
        $(element).append(`
            <div class="loader-wrap" ${data.style ? `style="${data.style}"` : ""}>
                <div class="loader" style="width: ${data.size}px; height: ${data.size}px;"><div></div><div></div><div></div><div></div></div>
            </div>`)
    },
    remove: element =>
    {
        $(element).find('.loader-wrap').remove()
    }
}
