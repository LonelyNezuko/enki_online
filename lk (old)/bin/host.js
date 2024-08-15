var host = 
{
	email: "support@enki-rp.ru",
	connectMail:
	{
		host: '185.235.128.124',
		port: 465,
		// secure: true,
		ignoreTLS: true,
		auth: {
			user: 'root',
			pass: 'password.Enki.20002017'
		}
		// tls: {
		//     // do not fail on invalid certs
		//     rejectUnauthorized: true
		// }
	},

	api:
	{
		secretKeys:
		[
			"test"
		]
	}
}

module.exports = host