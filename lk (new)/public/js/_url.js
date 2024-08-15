import router from './routes/_index.js'

export const url =
{
	set: (pathname = '/') =>
	{
		var state = { pageName: pathname }

		const href = window.location.origin + pathname
		history.pushState(state, "", href)
	},
	locate: (pathname = '/account', attrsURL = undefined, attrs = undefined) =>
	{
		var href = window.location.origin + pathname
		if(attrsURL != undefined) href += attrsURL

		url.check({ hostname: window.location.hostname, pathname: pathname, href: href, search: attrs })
	},
	check: (data) =>
	{
		if(data.hostname != window.location.hostname)return window.location.href = data.href
		router.get(data.pathname, data.search == undefined ? {} : data.search)

		if(data.return == undefined)
		{
			var state = { pageName: data.pathname }
			history.pushState(state, "", data.href)
		}
	},
    getSearch: href =>
    {
        var
    		urlData = new URL(href),
    		attrs = {}

    	for(var value of new URLSearchParams(urlData.search.split('?')[1])) attrs[value[0]] = value[1]
        return attrs
    }
}
export default url
