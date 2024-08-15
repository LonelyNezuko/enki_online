const dialog =
{
	timer: null,

	type: "none",
	id: null,
	data: null,

	show: (title, type, id, text, btnClose = "Закрыть", btnSuccess = null, timer = true, data = null, options = {}) =>
	{
		dialog.close()

		dialog.type = type
		dialog.id = id

		$('.dialog .dialog-title').html(title)
		$('.dialog .dialog-desc').html(text)

		$('.dialog #dialog-btn-close').html(btnClose)
		$('.dialog #dialog-btn-success').html(btnSuccess)

		$('.dialog').removeClass('dialog-notf')

		switch(type)
		{
			case "error":
			{
				$('.dialog').addClass('dialog-notf')
				$('.dialog').css({ "background-color": "#d46666", "color": "white" })

				break
			}
			case "success":
			{
				$('.dialog').addClass('dialog-notf')
				$('.dialog').css({ "background-color": "#47a5d8", "color": "white" })

				break
			}
			case "dialog":
			{
				$('.dialog .dialog-title').css('color', 'orange')
				$('.dialog #dialog-btn-success').css('border-color', 'orange')

				$('.dialog').css({ "background-color": "white" })
				break
			}
			case 'accept':
			{
				$('.dialog .dialog-title').css('color', 'blue')
				$('.dialog #dialog-btn-success').css('border-color', 'blue')

				$('.dialog').css({ "background-color": "white" })
				break
			}
			case 'input':
			{
				$('.dialog .dialog-title').css('color', '#82c875')
				$('.dialog #dialog-btn-success').css('border-color', '#82c875')

				$('.dialog .dialog-desc').append(`<br><br><br><input type="text" class="dialog-input" data-dialog-input-id="1">`)
				$('.dialog').css({ "background-color": "white" })

				break
			}
			case '2input':
			{
				$('.dialog .dialog-title').css('color', '#82c875')
				$('.dialog #dialog-btn-success').css('border-color', '#82c875')

				$('.dialog .dialog-desc').append(`<br><br><br><input ${options.inputplace && options.inputplace[0] ? `placeholder="${options.inputplace[0]}"` : ""} type="text" class="dialog-input" data-dialog-input-id="1">`)
				$('.dialog .dialog-desc').append(`<br><br><br><input ${options.inputplace && options.inputplace[1] ? `placeholder="${options.inputplace[1]}"` : ""} type="text" class="dialog-input" data-dialog-input-id="2">`)

				$('.dialog').css({ "background-color": "white" })

				break
			}
			case '3input':
			{
				$('.dialog .dialog-title').css('color', '#82c875')
				$('.dialog #dialog-btn-success').css('border-color', '#82c875')

				$('.dialog .dialog-desc').append(`<br><br><br><input ${options.inputplace && options.inputplace[0] ? `placeholder="${options.inputplace[0]}"` : ""} type="text" class="dialog-input" data-dialog-input-id="1">`)
				$('.dialog .dialog-desc').append(`<br><br><br><input ${options.inputplace && options.inputplace[1] ? `placeholder="${options.inputplace[1]}"` : ""} type="text" class="dialog-input" data-dialog-input-id="2">`)
				$('.dialog .dialog-desc').append(`<br><br><br><input ${options.inputplace && options.inputplace[2] ? `placeholder="${options.inputplace[2]}"` : ""} type="text" class="dialog-input" data-dialog-input-id="3">`)

				$('.dialog').css({ "background-color": "white" })

				break
			}
			default:
			{
				$('.dialog .dialog-title').css('color', 'black')
				$('.dialog #dialog-btn-success').css('border-color', 'black')
				break
			}
		}

		if(type !== 'error' && type !== 'success')
		{
			if(btnSuccess == null) $('.dialog #dialog-btn-success').hide()
			else $('.dialog #dialog-btn-success').show()
		}

		$('.dialog').addClass('dialog-show')
		if(timer
			|| type === 'error' || type === 'success') dialog.timer = setTimeout(dialog.close, 5000)

		dialog.data = data
	},
	close: () =>
	{
		if(!$('.dialog').hasClass('dialog-show'))return false

		$('.dialog').removeClass('dialog-show')
		if(dialog.timer != null)
		{
			clearTimeout(dialog.timer)
			dialog.timer = null
		}
	},
	trigger: () =>
	{
		if(!$('.dialog').hasClass('dialog-show'))return false
		if(dialog.id == null)return false

		var
			input = $('.dialog .dialog-input[data-dialog-input-id="1"]').val(),
			input2 = $('.dialog .dialog-input[data-dialog-input-id="2"]').val(),
			input3 = $('.dialog .dialog-input[data-dialog-input-id="3"]').val()

		$('.dialog').trigger('dialogSuccess', { dialogid: dialog.id, inputs: [ input, input2, input3 ], data: dialog.data })
	}
}
const notfAcc = (text, accID = 0) =>
{
	$.post('/dialog/create', { accID: accID, text: text }, results =>
	{
		if(results === 'dialogound')return __removeAccCookies()
		if(results === 'error')return false
	})
}


$(document).ready(() =>
{
	$('body').prepend(`
		<div class="dialog">
			<style>
				.dialog
				{
					position: fixed;

					top: -20px;
					left: 50%;

					transform: translateX(-50%);

					background-color: white;
					color: black;

					z-index: 10000;

					border-radius: 7px;
					box-shadow: 0 0 25px 5px rgba(0,0,0,0.16);

					padding: 20px;

					max-width: 40%;
					min-width: 10%;

					opacity: 0;
					visibility: hidden;

					transition: .3s;
				}
				.dialog .dialog-title
				{
					margin-bottom: 20px;

					font-size: 22px;
					text-align: center;
					text-transform: uppercase;
				}
				.dialog .dialog-desc
				{
					margin-bottom: 30px;
					text-align: center;

					color: #222;
				}
				.dialog .dialog-button
				{
					display: flex;
					justify-content: flex-end;

					align-items: center;
					flex-wrap: wrap;
				}
				.dialog .dialog-button button
				{
					background-color: red;
					border: 2px solid red;

					border-radius: 4px;

					padding: 10px 30px;
					color: white;

					cursor: pointer;
					transition: .3s;

					margin-top: 10px;
				}
				.dialog .dialog-button button + button
				{
					margin-left: 10px;
				}

				.dialog .dialog-button button#dialog-btn-success
				{
					background-color: transparent;
					color: black;

					border-color: green;
				}
				.dialog .dialog-button button#dialog-btn-success:hover
				{
					background-color: green;
					color: white;
				}

				.dialog.dialog-show
				{
					opacity: 1;
					visibility: visible;

					top: 30px;
				}

				.dialog .dialog-timer
				{
					position: absolute;

					left: 20px;
					top: 20px;

					background-color: red;
				}

				.dialog-timer-spin
				{
					/*animation: rotate 2s linear infinite;*/
					transform: rotate(-90deg);
				}
				.dialog-timer-path
				{
				    stroke: red;
				    stroke-linecap: round;
				    /*animation: dash 2s ease infinite;*/

				    stroke-dasharray: 150, 150;
				    stroke-dashoffset: 150;
				}
				.dialog .dialog-input
				{
					width: calc(100% - 30px);

					border: 2px solid #82c875;
					border-radius: 10px 0 10px 0;

					box-shadow: 0 0 15px 3px rgba(130, 200, 117, 0.5);

					outline: 0;
					padding: 15px 10px;

				}


				.dialog.dialog-notf.dialog-show
				{
					top: 15px;
				}
				.dialog.dialog-notf
				{
					top: -100%;

					left: auto;
					right: 15px;

					transform: none;

					background-color: #d46666;
					color: white;

					padding: 0;

					display: flex;
					justify-content: center;
					align-items: center;

					overflow: hidden;

					min-width: 250px;
					max-width: 500px;
				}
				.dialog.dialog-notf .dialog-title,
				.dialog.dialog-notf .dialog-button
				{
					display: none;
				}
				.dialog.dialog-notf .dialog-desc
				{
					margin: 0;

					padding: 10px 15px;
					text-align: left;

					color: inherit;
					width: calc(100% - 30px);
				}


				@media screen and (max-width: 500px)
				{
					.dialog
					{
						min-width: 85%;
						max-width: 85%;
					}	
				}
			</style>

			<div class="dialog-title" style="color: orange;"></div>
			<div class="dialog-desc"></div>
			<div class="dialog-button">
				<button id="dialog-btn-close"></button>
				<button id="dialog-btn-success"></button>
			</div>
		</div>`)

	$('.dialog #dialog-btn-close').on('click', dialog.close)
	$('.dialog #dialog-btn-success').on('click', dialog.trigger)

	$('.dialog #dialog-btn-success').hover(() =>
	{
		switch(dialog.type)
		{
			case "error":
			{
				$('.dialog #dialog-btn-success').css({ 'background-color': 'red', 'color': 'white' })
				break
			}
			case "success":
			{
				$('.dialog #dialog-btn-success').css({ 'background-color': 'green', 'color': 'white' })
				break
			}
			case "dialog":
			{
				$('.dialog #dialog-btn-success').css({ 'background-color': 'orange', 'color': 'white' })
				break
			}
			case 'accept':
			{
				$('.dialog #dialog-btn-success').css({ 'background-color': 'blue', 'color': 'white' })
				break
			}
			case 'input', '3input':
			{
				$('.dialog #dialog-btn-success').css({ 'background-color': '#82c875', 'color': 'white' })
				break
			}
			default:
			{
				$('.dialog .dialog-title').css('color', 'black')
				$('.dialog #dialog-btn-success').css('border-color', 'black')
				break
			}
		}

	}, () =>
	{
		$('.dialog #dialog-btn-success').css({ 'background-color': 'transparent', 'color': 'black' })
	})
})