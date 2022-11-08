export function isObject (v) {
  return v !== null && typeof v === 'object' && Array.isArray(v) !== true
}

export function isDate (v) {
  return Object.prototype.toString.call(v) === '[object Date]'
}

export function isRegexp (v) {
  return Object.prototype.toString.call(v) === '[object RegExp]'
}

export function isNumber (v) {
  return typeof v === 'number' && isFinite(v)
}

export function isEmail (v) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(v);
}

export default {
  object: isObject,
  date: isDate,
  regexp: isRegexp,
  number: isNumber,
  email: isEmail
}
