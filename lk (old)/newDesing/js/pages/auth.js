const auth =
{
    login: (name, password) =>
    {
        if(name.length < 4 || name.length > 24)return auth.error('Некорретный игровой ник')
        if(password.length < 6 || password.length > 64)return auth.error('Некорретный пароль')

        loader.append('.auth section:nth-child(2)', {
            style: 'width: 100%; height: 100%; background-color: rgba(0, 0, 0, .5); display: flex; justify-content: center; align-items: center; border-radius: 0 10px 10px 0;'
        })
        setTimeout(() =>
        {
            auth.error('Упс! Кажется авторизации пока нет :(')
            loader.remove('.auth section:nth-child(2)')
        }, 2000)
    },

    errorTimeout: null,
    error: (message, data = {}) =>
    {
        $('.auth .auth-error').html(message)
        $('.auth .auth-error').addClass('auth-error-show')

        if(auth.errorTimeout) clearTimeout(auth.errorTimeout)
        auth.errorTimeout = setTimeout(() =>
        {
            $('.auth .auth-error').removeClass('auth-error-show')
        }, data.time ? data.time : message.length < 40 ? message.length * 110 : 5000)
    }
}

$(document).ready(() =>
{
    $('.auth #auth-success').on('click', () =>
    {
        const
            name = $('.auth #auth-input-username').val(),
            password = $('.auth #auth-input-password').val()

        auth.login(name, password)
    })
})
