const loading =
{
	blockSaving: {},

	go: (data = { type: 'global', parent: 'body', set: false, message: undefined }) =>
	{
		if(data.type === 'global')
		{
			if($('.loading').hasClass('loading-go'))return false

			$('.loading').addClass('loading-go')

			if(data.bgcolor) $('.loading.loading-go').css('background-color', `rgba(0, 0, 0, ${data.bgcolor})`)
			else $('.loading.loading-go').css('background-color', `rgba(0, 0, 0, 0.6)`)
		}
		else if(data.type === 'point')
		{
			if(!data.set)
			{
				$(data.parent).append(`
					<div class="loading-point">
						<div class="loading-point-yellow"></div>
						<div class="loading-point-red"></div>
						<div class="loading-point-blue"></div>
						<div class="loading-point-violet"></div>
					</div>`)
			}
			else
			{
				loading.blockSaving[`${data.parent}`] = $(data.parent).html()
				$(data.parent).html(`
					<div class="loading-point">
						<div class="loading-point-yellow"></div>
						<div class="loading-point-red"></div>
						<div class="loading-point-blue"></div>
						<div class="loading-point-violet"></div>
					</div>`)
			}

			if(data.position
				&& data.position.top
				&& data.position.left)
			{
				$(data.parent).find('.loading-point').css({ 'position': 'absolute', 'top': data.position.top, 'left': data.position.left })
				if(data.position.transform) $(data.parent).find('.loading-point').css({ 'transform': data.position.transform })
			}
		}
		// else if(data.type === 'self')
		// {
		// 	// if(!data.set)
		// 	// {
		// 	// 	$(data.parent).append(`
		// 	// 		<div class="loading-min">
		// 	// 		    <div class="loading-min-left"><span></span></div>
		// 	// 		    <div class="loading-min-right"><span></span></div>
		// 	// 		</div>`)
		// 	// }
		// 	// else
		// 	// {
		// 	// 	loading.blockSaving[`${data.parent}`] = $(data.parent).html()
		// 	// 	$(data.parent).html(`
		// 	// 		<div class="loading-min">
		// 	// 			<span></span>
		// 	// 			${data.message ? `<h1>${data.message}</h1>` : ''}
		// 	// 		</div>`)
		// 	// }

		// 	$(data.parent).html(`<div class="loading-min" data-bg-color="${$(data.parent).css('background-color')}"></div>`)

		// 	// if(data.spinColor)
		// 	// {
		// 	// 	$('.loading-min span::after').css('border-color', data.spinColor)
		// 	// }
		// }
	},
	stop: (data = { type: 'global', parent: 'body' }) =>
	{
		if(data.type === 'global')
		{
			if(!$('.loading').hasClass('loading-go'))return false
			$('.loading').removeClass('loading-go')
		}
		else if(data.type === 'self')
		{
			$(data.parent + " .loading-min").remove()
			if(loading.blockSaving[`${data.parent}`])
			{
				$(data.parent).html(loading.blockSaving[`${data.parent}`])
				delete loading.blockSaving[`${data.parent}`]
			}
		}
	}
}

$('body').append(`
	<div class="loading">
		<style>
			.loading
			{
			    position: fixed;

			    top: 0;
			    left: 0;

			    width: 100%;
			    height: 100%;

			    transition: .3s;
			    z-index: 5000;

			    display: flex;
			    justify-content: center;
			    align-items: center;

			    opacity: 0;
			    visibility: hidden;

			    display: none;
			}
			.loading.loading-go
			{
			    opacity: 1;
			    visibility: visible;

			    display: block;

			    background-color: rgba(0, 0, 0, 0.6)
			}

			.loading .loading-title
			{
			    position: absolute;

			    left: 50%;
			    top: 35%;

			    transform: translate(-50%, -50%);

			    color: white;
			    font-size: 35px;

			    text-align: center;
                font-weight: 500;
			}

			.loading .loading-circles-wrap
			{
			    position: absolute;

			    top: 50%;
			    left: 50%;

			    transform: translate(-50%, -50%);

			    display: flex;
			    align-items: center;
			}
			.loading .loading-circles
			{
			    border-radius: 50%;
			    background: #fff;

			    width: 13px;
			    height: 13px;

			    margin: 0 20px;
			}

			.loading.loading-go .loading-circles#loading-circles-1
			{
			    animation: loadingUpload 0.6s cubic-bezier(0.39, 0.56, 0.57, 1) 0s infinite alternate-reverse;
			    background-color: #4285f4;
			}

			.loading.loading-go .loading-circles#loading-circles-2
			{
			    animation: loadingUpload 0.8s cubic-bezier(0.39, 0.56, 0.57, 1) 0s infinite alternate-reverse;
			    background-color: #34a853;
			}

			.loading.loading-go .loading-circles#loading-circles-3
			{
			    animation: loadingUpload 1s cubic-bezier(0.39, 0.56, 0.57, 1) 0s infinite alternate-reverse;
			    background-color: #fbbc05;
			}

			.loading.loading-go .loading-circles#loading-circles-4
			{
			    animation: loadingUpload 1.2s cubic-bezier(0.39, 0.56, 0.57, 1) 0s infinite alternate-reverse;
			    background-color: #ea4335;
			}

			@keyframes loadingUpload
			{
			    from { transform: translateY(35px); }
			    to { transform: translateY(-35px); }
			}



			.loading-min {
			  animation: load3 1s infinite linear;
			  background: linear-gradient(to right, #ddd 10%, rgba(221, 221, 221, 0) 70%);
			  border-radius: 50%;
			  height: 50px;
			  margin: 5em auto;
			  position: relative;
			  width: 50px;
			}

			.loading-min:before {
			  width: 100%;
			  height: 50%;
			  background: #ddd;
			  border-radius: 50px 50px 0 0;
			  position: absolute;
			  top: 0;
			  left: 0;
			  content: '';
			}

			.loading-min:after {
			  background-color: attr(data-bg-color);
			  width: 60%;
			  height: 60%;
			  border-radius: 50%;
			  content: '';
			  margin: auto;
			  position: absolute;
			  top: 0;
			  left: 0;
			  bottom: 0;
			  right: 0;
			}

			@-webkit-keyframes load3 {
			  100% {
			    transform: rotate(360deg);
			  }
			}

			.loading-min h1
			{
				width: 100%;

				text-align: center;
				font-size: 20px;

				margin-top: 30px;
				color: #979797;
			}

			.loading-point
			{
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.loading-point div
			{
				width: 20px;
				height: 20px;

				border-radius: 100%;
				margin: 0 7px;

				background-image: linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(0,0,0,0) 100%);
				animation: loading-point-anim 1.5s 0.5s linear infinite;
			}

			.loading-point .loading-point-yellow {
				background-color: #feb60a;
			}

			.loading-point .loading-point-red {
				background-color: #ff0062;
				animation-delay: 0.1s;
			}

			.loading-point .loading-point-blue {
				background-color: #00dbf9;
				animation-delay: 0.2s;
			}

			.loading-point .loading-point-violet {
				background-color: #da00f7;
				animation-delay: 0.3s;
			}

			@keyframes loading-point-anim {
				0%, 50%, 100% {
					transform: scale(0.7);
					filter: blur(0px);
				}
				25% {
					transform: scale(0.3);
					filter: blur(1px);
				}
				75% {
					filter: blur(1px);
					transform: scale(1);
				}
			}
		</style>

		<div class="loading-title">Пожалуйста, подождите</div>
		<div class="loading-circles-wrap">
			<div class="loading-circles" id="loading-circles-1"></div>
			<div class="loading-circles" id="loading-circles-2"></div>
			<div class="loading-circles" id="loading-circles-3"></div>
			<div class="loading-circles" id="loading-circles-4"></div>
		</div>
	</div>`)

loading.go({ type: 'global', bgcolor: '1.0' })
