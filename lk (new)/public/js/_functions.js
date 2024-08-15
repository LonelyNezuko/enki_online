const functions = {
    getCookie: name =>
    {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"))
        return matches ? decodeURIComponent(matches[1]) : undefined
    },
    random: (min, max) =>
    {
        let rand = min + Math.random() * (max - min);
        return Math.round(rand);
    },
    getBase64FromImageUrl: (url) =>
    {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        };
        img.src = url;
    },

    googleAuthCode: (section, callback) =>
    {
        $(section).append(`
            <section class="googleauth-code">
                <img src="/images/googleauth.png">
                <div>
                    <input type="number" placeholder=" ">
                    <input type="number" placeholder=" ">
                    <input type="number" placeholder=" ">
                    <input type="number" placeholder=" ">
                    <input type="number" placeholder=" ">
                    <input type="number" placeholder=" ">
                </div>
            </section>`)
        setTimeout(() => $(section).find('.googleauth-code input:first-child').focus(), 100)

        $(section).find('.googleauth-code input').on('input', elem =>
        {
            const val = $(elem.currentTarget).val()
            console.log(val.length)

            if(val.length !== 0)
            {
                function _callback()
                {
                    const value = $(section).find('.googleauth-code input:nth-child(1)').val() +
                        $(section).find('.googleauth-code input:nth-child(2)').val() +
                        $(section).find('.googleauth-code input:nth-child(3)').val() +
                        $(section).find('.googleauth-code input:nth-child(4)').val() +
                        $(section).find('.googleauth-code input:nth-child(5)').val() +
                        $(section).find('.googleauth-code input:nth-child(6)').val()
                    if(callback) callback($(section).find('.googleauth-code'), value)

                    $(section).find('.googleauth-code input').blur()
                }

                if(val.length > 1)
                {
                    let count = 0
                    $(section).find('.googleauth-code input').each((i, item) =>
                    {
                        if(count < val.length)
                        {
                            $(item).val(val[i])
                            count ++
                        }
                    })

                    if(count !== 6) $(section).find(`.googleauth-code input:nth-child(${count + 1})`).focus()
                    else _callback()
                }
                else
                {
                    if($(elem.currentTarget).next().length === 0) _callback()
                    else $(elem.currentTarget).next().focus()
                }
            }
        })
    }
}

export default functions
