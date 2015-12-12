'use strict';

function parseExpAsDate(expDate) {
  return {
    month: (expDate.getMonth() + 1).toString(),
    year: expDate.getFullYear().toString().substr(2)
  };
}

module.exports = {
  last4: function(cardNumber) {
    if (typeof cardNumber === 'string') {
      let cleaned = cardNumber.replace(/[^0-9]/g, '');
      if (cleaned.length > 4)
        return cleaned.substr(cleaned.length - 4);
    }
    return '';
  },
  parseExpiration: function(expDate) {
    if (expDate instanceof Date)
      return parseExpAsDate(expDate);
    else if (typeof expDate === 'string') {
      if (/^\d{1,2}-(\d{2}|\d{4})$/.test(expDate))
        return parseExpAsDate(new Date('1-' + expDate));
      else
        return parseExpAsDate(new Date(expDate));
    }
    else if (typeof expDate === 'number')
      return parseExpAsDate(new Date(expDate));
    return {};
  },
  padLeft: function(thePad, str) {
    return thePad.substring(0, thePad.length - str.length) + str;
  }
};
