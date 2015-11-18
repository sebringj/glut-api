module.exports = {
		port: process.env.PORT,
		// mongo connection string
		mongodb: process.env.MONGODB,
		passportJwtOptions: {
			issuer: process.env.JWT_ISSUER,
			secretOrKey: process.env.JWT_SECRET
		}
};
