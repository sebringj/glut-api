'use strict';

let senderStreets = [];
let inc = 1;
while (process.env['SENDER_STREET_' + inc]) {
	senderStreets.push(process.env['SENDER_STREET_' + inc]);
	inc++;
}

let applicableSalesTax = {};
let applicableSalesTaxPairs = process.env.APPLICABLE_SALES_TAX.split(',');
applicableSalesTaxPairs.forEach(function(pair) {
	let parts = pair.split('=');
	let tax = parseFloat(parts[1].trim());
	if (isNaN(tax))
		throw parts[0].trim() + ' sales tax not number type';
	applicableSalesTax[parts[0].trim()] = parseFloat(parts[1].trim());
});

let config = {
	port: process.env.PORT,
	sslPort: process.env.SSL_PORT,
	sslKey: process.env.SSL_KEY,
	sslCert: process.env.SSL_CERT,
	mongodb: process.env.MONGODB,
	passportJwtOptions: {
		issuer: process.env.JWT_ISSUER,
		secretOrKey: process.env.JWT_SECRET
	},
  letsEncrypt: {
    domains: (process.env.LETSENCRYPT_DOMAINS || '').split(','),
    email: process.env.LETSENCRYPT_EMAIL,
  },
	hallpassUrl: process.env.HALLPASS_URL,
	paymentProvider: process.env.PAYMENT_PROVIDER,
	paymentProviders: {
		authnet: {
			sandbox: (process.env.AUTHNET_SANDBOX === 'true'),
			apiLoginId: process.env.AUTHNET_LOGIN_ID,
			transactionKey: process.env.AUTHNET_TRANSACTION_KEY,
			endpoint: process.env.AUTHNET_ENDPOINT
		}
	},
	shippingProvider: process.env.SHIPPING_PROVIDER,
	shippingProviders: {
		fedex: {
			environment: process.env.FEDEX_ENVIRONMENT,
			debug: (process.env.FEDEX_DEBUG === 'true'),
			key: process.env.FEDEX_KEY,
			password: process.env.FEDEX_PASSWORD,
			account_number: process.env.FEDEX_ACCOUNT_NUMBER,
			meter_number: process.env.FEDEX_METER_NUMBER,
			imperial: (process.env.FEDEX_IMPERIAL === 'true')
		}
	},
	senderAddress: {
		streets: senderStreets,
		city: process.env.SENDER_CITY,
		stateOrProvinceCode: process.env.SENDER_STATE_OR_PROVINCE_CODE,
		postalCode: process.env.SENDER_POSTAL_CODE,
		countryCode: process.env.SENDER_COUNTRY_CODE
	},
	email: {
		provider: 'gmail',
		providers: {
			gmail: require('nodemailer').createTransport({
				service: 'gmail',
				auth: {
					user: process.env.GMAIL_USER,
					pass: process.env.GMAIL_PASS
				}
			})
		},
		receipt: {
			from: process.env.EMAIL_RECEIPT_FROM,
			subject: process.env.EMAIL_RECEIPT_SUBJECT,
			notifyEmail: process.env.EMAIL_RECEIPT_NOTIFY
		}
	},
	applicableSalesTax: applicableSalesTax
};

module.exports = config;
