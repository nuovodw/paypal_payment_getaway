// Requring express library and paypal-rest-sdk

const express = require('express');
const paypal = require('paypal-rest-sdk');

paypal.configure({
	mode: 'sandbox', //sandbox (change to 'live' upon testing sandbox)
	client_id:
		'AUJ87qMa8TxTWzK1zfhrtwGNHJsAOWAM5av44JoVicT_WereiuBUqDebcSFdZj9qZC7rm6sWQUQ4qgaJ',
	client_secret:
		'ENHLkyfb7bqIkFWTkkDyqFNFpl38zNYNmICXm3wcZYWxIHchUmXZow5QuwA6SpKTPYKnPftye7Apn0s8',
});

const PORT = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// Post request to routh /pay (upon pressing the pay button)
app.post('/pay', (req, res) => {
	const create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal',
		},
		redirect_urls: {
			return_url: 'http://localhost:3000/success',
			cancel_url: 'http://localhost:3000/cancel',
		},
		transactions: [
			{
				item_list: {
					items: [
						{
							name: 'Mouthpiece Patch',
							sku: '001',
							price: '3.00',
							currency: 'USD',
							quantity: 1,
						},
					],
				},
				amount: {
					currency: 'USD',
					total: '3.00',
				},
				description: 'Protect your clarinet mouthpiece',
			},
		],
	};

	paypal.payment.create(create_payment_json, function (error, payment) {
		if (error) {
			throw error;
		} else {
			for (let i = 0; i < payment.links.length; i++) {
				if (payment.links[i].rel === 'approval_url') {
					res.redirect(payment.links[i].href);
				}
			}
		}
	});
});

app.get('/success', (req, res) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;

	const execute_payment_json = {
		payer_id: payerId,
		transactions: [
			{
				amount: {
					currency: 'USD',
					total: '3.00',
				},
			},
		],
	};

	paypal.payment.execute(
		paymentId,
		execute_payment_json,
		function (error, payment) {
			if (error) {
				console.log(error.response);
				throw error;
			} else {
				console.log(JSON.stringify(payment));
				res.send('Success');
			}
		},
	);
});

app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
