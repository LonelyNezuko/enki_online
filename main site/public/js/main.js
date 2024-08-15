// $(document).ready(() =>
// {
// 	const anchor = document.location.href.substring(document.location.href.indexOf("#") + 1)

// 	if(anchor != document.location.href
// 		&& anchor != ''
// 		&& anchor != ' '
// 		&& anchor)
// 	{
// 		$(window).animate({
// 			scrollTop:  $(anchor).offset().top
// 		})
// 		$(window).animate(
// 		{
// 			scrollTop:  $(anchor).offset().top  // #4
// 			}, 600);                            // #5
// 		});
// 	}
// })


$('body').ready(() =>
{
	colorSetTheme()
})
$(document).ready(() =>
{
	$('.burger-btn').on('click', () => $('.burger-menu').addClass('burger-menu-show'))
	$('.burger-menu .burger-menu-exit').on('click', () => $('.burger-menu').removeClass('burger-menu-show'))

	$(document).mouseup(e =>
	{
		if($('.burger-menu').hasClass('burger-menu-show'))
		{
			var div = $('.burger-menu .burger-menu-body')

			if(!div.is(e.target)
			    && div.has(e.target).length === 0) $('.burger-menu').removeClass('burger-menu-show')
		}
	})

	$('.color').on('click', () => $('.color-menu').addClass('color-menu-show'))
	$('.color-menu .items .item').on('click', elem => colorMenuChange($(elem.currentTarget).attr('data-color')))
	$(document).mouseup(elem =>
	{
		if($('.color-menu').hasClass('color-menu-show')
			&& $('.color-menu .items').has(elem.target).length === 0) $('.color-menu').removeClass('color-menu-show')
	});
})

function colorMenuChange(color)
{
	localStorage.setItem('color-theme', `${color}`)
	window.location.href = window.location.href
}
function colorSetTheme()
{
	let color = localStorage.getItem('color-theme')
	if(!color) color = 'all'

	if(color === 'all')
	{
		const colors = [ "FFFFFF", "333b62", "691717", "#0F0F0F", "562762", "2D4E18" ]
		color = colors[Math.floor(Math.random() * colors.length)]
	}

	$('body').addClass(`color-${color}`)
	if(window.location.pathname !== '/news'
		&& window.location.pathname !== '/') loading.stop()
}