'use strict';

let senderStreets = [];
let inc = 1;
while (process.env['SENDER_STREET_' + inc]) {
	senderStreets.push(process.env['SENDER_STREET_' + inc]);
	inc++;
}

module.exports = {
	port: process.env.PORT,
	// mongo connection string
	mongodb: process.env.MONGODB,
	passportJwtOptions: {
		issuer: process.env.JWT_ISSUER,
		secretOrKey: process.env.JWT_SECRET
	},
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
	applicableSalesTax: {
		CA: 0.08
	}
};
