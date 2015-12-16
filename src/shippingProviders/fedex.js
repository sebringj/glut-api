'use strict';

let senderAddress = require('config').senderAddress;
let fedexConfig = require('config').shippingProviders.fedex;
let fedexApi = require('shipping-fedex');
let validation = require('../utils/validation');
let _ = require('lodash');

let fedex = new fedexApi(fedexConfig);

function methods() {
	let promise = new Promise(function(resolve, reject) {
		resolve(fedex.service_types);
	});
	return promise;
}

function rates(obj) {

	if (!obj || !validation.hasAllProps(obj, ['shippingMethod', 'products', 'address']))
		return Promise.reject('params missing');

	let promise = new Promise(function(resolve, reject) {
		fedex.rates({
			ReturnTransitAndCommit: true,
			CarrierCodes: ['FDXE', 'FDXG'],
			RequestedShipment: {
				ServiceType: obj.shippingMethod,
				Shipper: {
					Address: {
						StreetLines: senderAddress.streets,
						City: senderAddress.city,
						StateOrProvinceCode: senderAddress.stateOrProvinceCode,
						PostalCode: senderAddress.postalCode,
						CountryCode: senderAddress.countryCode
					}
				},
				Recipient: {
					Address: {
						StreetLines: obj.address.streets,
						City: obj.address.city,
						StateOrProvinceCode: obj.address.stateOrProvinceCode,
						PostalCode: obj.address.postalCode,
						CountryCode: obj.address.countryCode
					}
				},
				ShippingChargesPayment: {
		      PaymentType: 'SENDER',
		      Payor: {
		        ResponsibleParty: {
		          AccountNumber: fedexConfig.account_number
		        }
		      }
		    },
				PackageCount: obj.packages.length,
		    RequestedPackageLineItems: _.map(obj.packages, function(objPackage) {
					return {
						SequenceNumber: objPackage.sequence,
						GroupPackageCount: objPackage.groupPackageCount,
						Weight: {
							Units: objPackage.weight.unit,
							Value: objPackage.weight.value
						},
						Dimensions: {
							Length: objPackage.dimensions.length,
			        Width: objPackage.dimensions.width,
			        Height: objPackage.dimensions.height,
			        Units: objPackage.dimensions.unit
						}
					};
				})
			}
		}, function(err, res) {
			if (err)
				return reject(err);

			let deliveryDay = _.get(res, 'RateReplyDetails[0].DeliveryDayOfWeek');
			let rateReplyDetails = _.get(res, 'RateReplyDetails', []);
			let total = 0;
			let currency = 'USD';

			rateReplyDetails.forEach(function(rateReplyDetail) {
				let ratedShipmentDetails = _.get(rateReplyDetail, 'RatedShipmentDetails', []);
				ratedShipmentDetails.forEach(function(ratedShipmentDetail) {
					let objTotal = _.get(ratedShipmentDetail, 'ShipmentRateDetail.TotalNetCharge', {
						Currency: 'USD',
						Amount: 0
					});
					total += parseFloat(objTotal.Amount);
					currency = objTotal.Currency;
				});
			});

			resolve({
				deliveryDay: deliveryDay,
				total: {
					currency: currency,
					amount: total
				}
			});
		});
	});
	return promise;
}

module.exports = {
	methods,
	rates
};
