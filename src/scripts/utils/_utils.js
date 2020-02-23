/**
 *
 * List of utilities
 * @module utils/_
 *
 * */


/**
 * @param {(Array|NodeList)} input
 * @param {function} cb https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 * @param {object} [context]
 * @return {Array}
 * */
export function map(input, cb, context) {
  return (Array.prototype.slice.call(input)).map(cb, context);
}

/**
 * @param {(Array|NodeList)} input
 * @param {function} cb
 * @param {object} [context]
 * @return {undefined}
 * */
export function each(input, cb, context) {
  (Array.prototype.slice.call(input)).forEach(cb, context);
}

/**
 * @param {(Array|NodeList)} input
 * @param {function} cb
 * @param {Object} [context]
 * @return {Array}
 * */
export function filter(input, cb, context) {
  return (Array.prototype.slice.call(input)).filter(cb, context);
}

/**
 * @param {Object} inputObject
 * @return {Array}
 * */
export function keys(inputObject) {
  return Object.keys(inputObject);
}

/**
 * @param {*} input
 * @return {boolean}
 * */
export function isObject(input) {
  return Object.prototype.toString.call(input).toLowerCase() === '[object object]';
}

/**
 * @param {*} input
 * @return {boolean}
 * */
export function isFunction(input) {
  return typeof input === 'function';
}

/**
 * @param {Object} subject
 * @return {boolean}
 * */
export function isPromise(subject) {
  return isFunction(subject.then);
}

/**
 * @param {*} input
 * @return {boolean}
 * */
export function isArray(input) {
  return Object.prototype.toString.call(input) === '[object Array]';
}

/**
 * @param {Object} parent
 * @param {Object} child
 * @return {Object}
 * */
export function objectAssign(parent, child) {
  return Object.assign({}, parent, child);
}

/**
 * @param {string} text
 * @param {Array} patterns
 * @return {string}
 * */
export function replace(text, patterns) {
  let output = text;

  each(keys(patterns), (pattern) => {
    const value = patterns[pattern];

    output = output.replace(
      new RegExp('%' + pattern + '%', 'g'),
      value
    );
  });

  return output;
}

/**
 * @param {string|number} x
 * @return {number}
 * */
export function toInt(x) {
  return parseInt(x, 10);
}

/**
 * @param {Array} array
 * @param {string|number|null|undefined|boolean} value
 * @return {number}
 * */
export function inArray(array, value) {
  return array.indexOf(value);
}


/**
 * @param {*} input
 * @return {boolean}
 * */
export function isString(input){
  return "string" == typeof input || input instanceof String
}

/**
 * @param {Array} array
 * @param {string|number|null|undefined|boolean} search
 * @return {Array}
 * */
export function removeFromArray(array, search) {
  const position = array.indexOf(search);

  return position > -1 ? array.slice(position, 1) : array;
}

/**
 * @param {Object} obj
 * @param {string} property
 * @return {boolean}
 * */
export function hasProperty(obj, property) {
  return ({}).hasOwnProperty.call(obj, property);
}

/**
 * @param {string|array} input
 * @return {number}
 * */
export function len(input) {
  return input.length;
}

/**
 * @param {*} input
 * @return {boolean}
 * */
export function isUndefined(input) {
  return input === undefined;
}

/**
 * @param {Array} array
 * @param {string} [separator]
 * @return {string}
 * */
export function joinArray(array, separator="") {
  return array.join(separator);
}

/**
 * @param {number} seconds
 * @return {Promise}
 * */
export function wait(seconds) {
  return new Promise((approve, reject) => {
    setTimeout(() => {
      approve();
    }, seconds);
  });
}

/**
 * @return {string}
 * */
export function sepNumber(r, e) {
  return e = e || ",", r = String(r).replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (r) => {
    return 15 & r.charCodeAt(0);
  }).replace(/(?:[^\.]|^)\b(\d+)/g, (r) => {
    return r = r.replace(/\B(?=(\d{3})+\b)/g, e);
  });
}

/**
 * @param {Array} array
 * @param {number} pageSize
 * @param {number} pageNumber
 * @return {Array}
 * */
export function paginate(array, pageSize, pageNumber) {
  --pageNumber;

  return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
}

export const _ = {
  map, filter, keys, isObject, isFunction, isArray, objectAssign,
  replace, toInt, inArray, removeFromArray, hasProperty, len,
  isUndefined, joinArray, wait, isString, each, isPromise, sepNumber,
  paginate
};