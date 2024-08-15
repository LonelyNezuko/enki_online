import functions from './_functions.js'

const auth = {
    removeAccountCookies: (exit = true) =>
    {
        const date = new Date()
    	date.setTime(date.getTime() - 1)

    	document.cookie = `auth=; expires=${date.toGMTString()}`
    	if(window.location.pathname !== '/login'
            && exit) window.location.href = "/login"
    },
    addAccountCookies: (uid, password, server) =>
    {
        const date = new Date()
    	date.setTime(date.getTime() + 86400000)

        document.cookie = `auth=${JSON.stringify({
            uid: uid,
            password: password,
            server: server })}; expires=${date.toGMTString()}`
    },

    getSavedAccoutns: () =>
    {
        const cookie = functions.getCookie('savedAccounts')
        if(!cookie)return undefined

        return JSON.parse(cookie)
    }
}

export default auth
