'use strict';

let _ = require('lodash');

function hasAllProps(obj, arr) {
	if (!Array.isArray(arr))
		arr = [arr];
	for (let item of arr) {
		if (!_.has(obj, item)) {
			return false;
		}
	}
	return true;
}

function isValidActor(actor) {
	if (!hasAllProps(actor, [
		'address', 'contact'
	]))
		return false;

	if (!hasAllProps(actor.contact, [
		'firstName', 'lastName', 'email', 'phone'
	]))
		return false;

	if (!hasAllProps(actor.address, [
		'streets', 'city', 'stateOrProvince', 'countryCode', 'postalCode'
	]))
		return false;

	return true;
}

module.exports = {
	hasAllProps, isValidActor
};
