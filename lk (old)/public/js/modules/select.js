const select =
{
	stylesLoader: false,

	add: (selector, elements, data = {}) =>
	{
		if(!selector
			|| !$('*').is(selector))return false
		if(!select.stylesLoader) createSelectStyles()

		$(selector).addClass('select')

		if(!data.defaultName) $(selector).removeAttr('data-select-type')
		else $(selector).attr('data-select-type', data.defaultName)

		$(selector).html(`
            <div class="select-title">${!data.defaultName ? "Не выбрано" : data.defaultName}</div>
            ${!data.hideArrow ? '<div class="select-arrow"></div>' : ''}

            <div class="select-list"></div>`)

		if(!data.reverse) $(selector + " .select-list").css('left', '0')
		else $(selector + " .select-list").css('right', '0')

		elements.forEach(item => $(selector + " .select-list").append(`<div class="select-list-item" data-select-type="${item}">${item}</div>`))
		if(data.elements
			&& data.elements.onclick)
		{
			$(selector + " .select-list .select-list-item").toArray().forEach((item, i) =>
			{
				$(item).attr('onclick', data.elements.onclick[i])
			})
		}
	},

	open: (selector) =>
	{
		if(!$('*').is(selector))return false

		$(selector).addClass('select-show')
	},
	close: (selector) =>
	{
		if(!$('*').is(selector)
			|| !$(selector).hasClass('select-show'))return false

		$(selector).removeClass('select-show')
	},
	change: (selector, type) =>
	{
		if(!$('*').is(selector)
			|| !$(selector).hasClass('select-show'))return false

		$(selector).attr('data-select-type', type)
		$(selector + " .select-title").html(type)

		select.close(selector)
		$(selector).trigger('selectChanges', { type: type })
	}
}

function createSelectStyles()
{
	$('body').prepend(`
		<style>
			.select
			{
				min-width: calc(120px - 40px);
				max-width: 250px;

				height: calc(40px - 14px);
				position: relative;

				background-color: white;
				box-shadow: 0 0 45px 3px rgba(0, 0, 0, 0.25);

				padding: 7px 20px;
				cursor: pointer;

				display: flex;
				justify-content: space-around;
				align-items: center;

				user-select: none;
				white-space: nowrap;

				color: black;
			}
			.select .select-title
			{
				height: 100%;

				display: flex;
				align-items: center;

				text-transform: uppercase;
				font-size: 15px;
			}
			.select .select-arrow
			{
				transform: rotate(135deg) translateY(50%);

				border-top: 1px solid black;
				border-right: 1px solid black;

				width: 10px;
				height: 10px;

				margin-left: 15px;
				transition: .3s;
			}

			.select.select-show .select-arrow
			{
				transform: rotate(-45deg) translateY(25%);
			}

			.select .select-list
			{
				position: fixed;

				opacity: 0;
				visibility: hidden;

				top: calc(100% + 15px);

				transition: .3s;

				background-color: white;
				box-shadow: 0 15px 55px 1px rgba(0, 0, 0, 0.16);

				min-width: 100%;
				width: auto;
				height: auto;

				display: flex;
				flex-wrap: wrap;

				z-index: 1000;
			}
			.select.select-show .select-list
			{
				position: absolute;

				opacity: 1;
				visibility: visible;

				top: calc(100% + 5px);
			}

			.select .select-list .select-list-item
			{
				width: calc(100% - 20px);
				height: calc(40px - 14px);

				display: flex;
				align-items: center;

				transition: .3s;
				cursor: pointer;

				padding: 7px 10px;
				text-align: center;
			}
			.select .select-list .select-list-item:hover
			{
				background-color: #eee;
			}
		</style>`)

	select.stylesLoader = true
}
$(document).ready(() =>
{
	$(document).on('click', '.select', elem =>
	{
		if($(elem.target).attr('class') == 'select-list')return false
		if($(elem.target).attr('class') == 'select-list-item')
		{
			var data = $(elem.target).attr('data-select-type')
			if(data == undefined)return false

			var selector = `#${$(elem.target).parent().parent().attr('id')}`
			select.change(selector, data)

			return false
		}

		var selector = `#${$(elem.target).attr('id')}`

		if(selector == '#undefined') selector = '#' + $(elem.target).parent().attr('id')
		if(selector == '#undefined')return false

		if($(selector).hasClass('select-show')) select.close(selector)
		else select.open(selector)
	})

	$(document).mouseup(e =>
	{
		if($('.select').hasClass('select-show'))
		{
			var div = $('.select.select-show')

			if(!div.is(e.target)
			    && div.has(e.target).length === 0) select.close('#' + $('.select.select-show').attr('id'))
		}
	})
})
