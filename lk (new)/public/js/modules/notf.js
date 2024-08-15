const notf = {
    send: (type, text, data = {}) =>
    {
        let newElement
        switch(type)
        {
            case 'error':
                newElement = $('.notf').prepend(`
                    <div class="notf-item notf-item-error">
                        <svg viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM8.04044 6.62623C7.64992 6.2357 7.01675 6.2357 6.62623 6.62623C6.2357 7.01675 6.2357 7.64992 6.62623 8.04044L8.75245 10.1667L6.62623 12.2929C6.2357 12.6834 6.2357 13.3166 6.62623 13.7071C7.01675 14.0976 7.64992 14.0976 8.04044 13.7071L10.1667 11.5809L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L11.5809 10.1667L13.7071 8.04044C14.0976 7.64992 14.0976 7.01675 13.7071 6.62623C13.3166 6.2357 12.6834 6.2357 12.2929 6.62623L10.1667 8.75245L8.04044 6.62623Z" fill="#FF3838"></path>
                        </svg>
                        <div>
                            <h1>Ошибка</h1>
                            <span>${text}</span>
                        </div>
                    </div>`).find('.notf-item:first-child')
                break
            case 'warning':
                newElement = $('.notf').prepend(`
                    <div class="notf-item notf-item-warning">
                        <svg viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM10 4C10.5523 4 11 4.44772 11 5V11C11 11.5523 10.5523 12 10 12C9.44771 12 9 11.5523 9 11V5C9 4.44772 9.44771 4 10 4ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44771 13 9 13.4477 9 14C9 14.5523 9.44771 15 10 15Z" fill="#FF9838"></path>
                        </svg>
                        <div>
                            <h1>Предупреждение</h1>
                            <span>${text}</span>
                        </div>
                    </div>`).find('.notf-item:first-child')
                break
            case 'success':
                newElement = $('.notf').prepend(`
                    <div class="notf-item notf-item-success">
                        <svg viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM14.7181 7.69597C15.1024 7.2994 15.0926 6.66631 14.696 6.28193C14.2994 5.89756 13.6663 5.90745 13.2819 6.30403L9.15385 10.5632L7.71807 9.0818C7.33369 8.68523 6.7006 8.67533 6.30403 9.05971C5.90745 9.44409 5.89756 10.0772 6.28193 10.4738L8.43578 12.696L9.15385 13.4368L9.87191 12.696L14.7181 7.69597Z" fill="#40B822"></path>
                        </svg>
                        <div>
                            <h1>Успех</h1>
                            <span>${text}</span>
                        </div>
                    </div>`).find('.notf-item:first-child')
                break
        }
        if(!newElement)return false

        setTimeout(() =>
        {
            $(newElement).css({
                'transform': 'translateX(100%)'
            })
            setTimeout(() => newElement.remove(), 200)
        }, data.time || 3000)
    }
}
