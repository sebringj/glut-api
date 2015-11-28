module.exports = {
		port: process.env.PORT,
		// mongo connection string
		mongodb: process.env.MONGODB,
		passportJwtOptions: {
			issuer: process.env.JWT_ISSUER,
			secretOrKey: process.env.JWT_SECRET
		},
		gateways: {
			authnet: {
				sandbox: (process.env.AUTHNET_SANDBOX === 'true'),
				apiLoginId: process.env.AUTHNET_LOGINID,
				transactionKey: process.env.AUTHNET_TRANSACTIONKEY,
				endpoint: process.env.AUTHNET_ENDPOINT
			}
		}
};
