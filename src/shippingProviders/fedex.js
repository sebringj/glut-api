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
				PackageCount: '1',
		    RequestedPackageLineItems: {
		      SequenceNumber: 1,
		      GroupPackageCount: 1,
		      Weight: {
		        Units: 'LB',
		        Value: '5.0'
		      },
		      Dimensions: {
		        Length: 15,
		        Width: 10,
		        Height: 1,
		        Units: 'IN'
		      }
		    }
			}
		}, function(err, res) {
			if (err)
				return reject(err);

			let deliveryDay = _.get(res, 'RateReplyDetails[0].DeliveryDayOfWeek');
			let total = _.get(res, 'RateReplyDetails[0].RatedShipmentDetails[0].ShipmentRateDetail.TotalNetCharge', {});
			resolve({
				deliveryDay: deliveryDay,
				total: {
					currency: total.Currency,
					amount: total.Amount
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
