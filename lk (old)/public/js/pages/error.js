export default function renderErrorPage(data = {})
{
	$('.wrapper').html(`
		<div class="error">
		    <div class="error-wrapper">
		    	<img src="/styles/images/error.png" alt="Ошибка!" />
		    	<span>${!data.message ? "Ошибка!" : data.message}</span>
		    </div>
		</div>`)
}
