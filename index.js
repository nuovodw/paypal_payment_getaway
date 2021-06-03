// Requring express library and paypal-rest-sdk

const express = require('express');
const paypal = require('paypal-rest-sdk');

paypal.configure({
	mode: 'sandbox', //sandbox (change to 'live' upon testing sandbox)
	client_id: '',
	client_secret: '',
});

const app = express();

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
