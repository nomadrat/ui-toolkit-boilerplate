/**
 * List of functions to work with DOM
 * @module utils/$
 * */


import { _ } from './_utils';

/**
 * Callback description for $.formSubmit
 * @callback formSubmit~Callback
 * @param {Object} formData
 * @param {Element} $form
 * @param {Event} event
 * */

/**
 * @param {string} query
 * @param {Element} [parentNode]
 * @return {Element}
 * */
export function one(query, parentNode) {
  return (parentNode || document).querySelector(query);
}

/**
 * @param {string} query
 * @param {Element} [parentNode]
 * @return {NodeList}
 * */
export function all(query, parentNode) {
  return (parentNode || document).querySelectorAll(query);
}

/**
 * @param {Element} element
 * @param {string} attributeName
 * @param {string} [attributeValue]
 * @return {(void|string)}
 * */
export function attr(element, attributeName, attributeValue) {
  if (attributeValue) {
    return element.setAttribute(attributeName, attributeValue);
  }

  return element.getAttribute(attributeName);
}

/**
 * @param {Element} element
 * @param {string} attribute
 * @return {Element}
 * */
export function removeAttribute(element, attribute) {
  element.removeAttribute(attribute);

  return element;
}

/**
 * @param {Function} cb
 * */
export function domReady(cb){
  let called = false;

  function ready() {
    if (called) return;
    called = true;

    cb();
  }

  if (document.readyState === 'complete') ready();
  if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready, false);
  if (window.addEventListener) window.addEventListener('load', ready, false);
}

/**
 * @param {string} name
 * @param {Object} attributes
 * @return {Element}
 * */
export function createElement(name, attributes) {
  attributes = attributes || {};

  if (name.indexOf('.') > -1) {
    attributes.className = name.split('.')[1];
    name = name.split('.')[0];
  }

  let element = document.createElement(name);

  _.map(_.keys(attributes), (attributeName) => {
    const value = attributes[attributeName];

    if ('html' === attributeName) {
      element.innerHTML = value;

    } else if ('css' === attributeName) {
      element = css(element, value);

    } else if ('dataset' === attributeName) {
      _.map(_.keys(value), (datasetKey) => {
        element.dataset[datasetKey] = value[datasetKey];
      });
    } else {
      element[attributeName] = value;
    }
  });

  return element;
}

/**
 * @param {Element} element
 * @param {Element} child
 * @return {Element}
 * */
export function append(element, child) {
  return element.appendChild(child);
}

/**
 * @param {Element} element
 * @param {string} [html]
 * @return {(Element|string)}
 * */
export function html(element, html=undefined) {
  if (_.isUndefined(html)) return element.innerHTML;

  element.innerHTML = html;

  return element;
}

/**
 * @param {Element} element
 * @return {Element}
 * */
export function clear(element) {
  element.innerHTML = "";

  return element;
}

/**
 * @param {Element} element
 * @param {Object} styles
 * @return {Element}
 * */
export function css(element, styles) {
  _.map(_.keys(styles), (cssProperty) => {
    element.style[cssProperty] = styles[cssProperty];
  });

  return element;
}

/**
 * @param {Element} element
 * @return {(DOMRect|ClientRect)}
 * */
export function size(element) {
  return element.getBoundingClientRect();
}

/**
 * @param {(Element|string)} query
 * @param {string} eventName
 * @param {Function} handler
 * @param {boolean} [captureNewElements]
 * */
export function on(query, eventName, handler, captureNewElements=false) {
  function $handler(event) {
    return handler(
      event,
      event.target === query ?
        event.target :
        getParent(event.target, query)
    );
  }

  if (_.isString(query)) {
    if (!captureNewElements) {
      all(query).forEach(function ($element) {
        $element.addEventListener(eventName, $handler);
      });

    } else {
      function bodyHandler(event) {
        const $target = event.target;
        const $element = getParent($target, query);

        if ($element) {
          $handler(event, $element);
        }
      }

      document.body.addEventListener(eventName, bodyHandler);
    }
  } else {
    query.addEventListener(eventName, $handler);
  }
}

/**
 * @param {Element} element
 * @param {string} eventName
 * @param {Function} handler
 * */
export function off(element, eventName, handler) {
  return element.removeEventListener(eventName, handler, false);
}

/**
 * @param {Element} element
 * @param {string} [value]
 * @return {(string|undefined)}
 * */
export function classnames(element, value) {
  if (!value) return element.className.toString();

  element.className = value;
}

/**
 * @param {Element} element
 * @param {string} csToRemove
 * @return {(Element|null)}
 * */
export function removeClass(element, csToRemove) {
  if (!element) return null;

  element.className = (
    _.filter(
      classnames(element).split(' '),
      (classname) => csToRemove !== classname
    )
  ).join(' ');

  return element;
}

/**
 * @param {Element} element
 * @param {string} classNames
 * @return {(Element|null)}
 * */
export function addClass(element, classNames) {
  if (!element) return null;

  element.className = (
    (classnames(element).split(' '))
      .concat(
        classNames.split(' ')
      )
  ).join(' ');

  return element;
}

/**
 * @param {(Element|string)} query
 * @param {Element} parent
 * */
export function remove(query, parent) {
  function removeElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  if (_.isString(query)) {
    all(query, parent).forEach( ($element) => {
      removeElement($element);
    });
  } else {
    removeElement(query);
  }
}

/**
 * @param {Element} element
 * @param {string} classname
 * @return {boolean}
 * */
export function hasClass(element, classname) {
  return classnames(element).indexOf(classname) > -1;
}

/**
 * @param {Element} element
 * @param {string} attributeName
 * @param {Function} [processResult]
 * @return {(string|*)}
 * */
export function data(element, attributeName, processResult) {
  const attributeValue = element.getAttribute('data-' + attributeName);

  if (processResult) {
    return processResult(attributeValue);
  }

  return attributeValue;
}

/**
 * @return {number}
 * */
export function clientWidth() {
  return document.documentElement.clientWidth;
}

/**
 * @return {number}
 * */
export function clientHeight() {
  return document.documentElement.clientHeight;
}

/**
 * @param {Element} element
 * @return {(DOMRect|ClientRect)}
 * */
export function getBoundingClientRect(element) {
  return element.getBoundingClientRect();
}

/**
 * @param {string} name
 * @return {(null|string)}
 * */
export function getQueryParam(name) {
  const url = window.location.href;
  const regex = new RegExp("[?&]" + (name.replace(/[\[\]]/g, "\\$&")) + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * @param {Element} node
 * @param {string} selector
 * @return {boolean}
 * */
export function isElementMatches(node, selector) {
  let p = Element.prototype, f;

  f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };

  return f.call(node, selector);
}

/**
 * @param {(Element|Node|ParentNode)} node
 * @param {string} selector
 * @return {(Element|Node|ParentNode)}
 * */
export function getParent(node, selector) {
  let _return;

  while (node.parentNode && node.localName !== 'body') {
    if (isElementMatches(node, selector)) {
      _return = node;

      break;
    } else {
      node = node.parentNode;
    }
  }

  return _return;
}

/**
 * @param {Element} element
 * @return {Node}
 * */
export function parent(element) {
  return element.parentNode;
}

/**
 * @param {string} formId
 * @param {formSubmit~Callback} cb
 * */
export function formSubmit(formId, cb) {
  return on(formId, "submit", (e) => {
    e.preventDefault();

    const formData = {};
    const $form = e.target;
    const $submitButton = one("[type='submit']", $form);
    const submitButtonText = $submitButton.innerText;

    attr($submitButton, "disabled", "disabled");

    // collection label for loading state from data-loading-text if presented
    // otherwise use text "Working..."
    html($submitButton, data($submitButton, "loading-text") || "Working...");

    _.each(all("input, select, textarea", $form), ($input) => {
      formData[$input.name] = $input.value;
    });

    const cbResult = cb(formData, $form, e);

    if (cbResult && _.isPromise(cbResult)) {
      cbResult.then((response) => {
        removeAttribute($submitButton, "disabled");
        html($submitButton, submitButtonText);
      });
    }
  }, true);
}

/**
 * @param {Element} $form
 * */
export function resetForm($form) {
  _.each(all("input, textarea", $form), ($input) => {
    $input.value = "";
  });
}

/**
 * @param {string} formCSSSelector
 * */
export function fillFormFromURL(formCSSSelector) {
  _.each(all("input", one(formCSSSelector)), ($input) => {
    const queryParamValue = getQueryParam($input.id);

    if(queryParamValue) {
      $input.value = queryParamValue;
    }
  })
}

/**
 * @param {Element} $container
 * @param {Element} $element
 * @return {Element}
 * */
export function insertFirstChild($container, $element) {
  return $container.insertAdjacentElement("afterbegin", $element);
}

/**
 * @param {Element} $referenceNode
 * @param {Element} $newElement
 * */
export function appendAfter($referenceNode, $newElement) {
  $referenceNode.parentNode.insertBefore($newElement, $referenceNode.nextSibling);
}

/**
 * @param {Element} $element
 * @param {string} [value]
 * */
export function val($element, value) {
  if (_.isUndefined(value)) return $element.value;

  $element.value = value;
}


export const $ = {
  one, all, attr, domReady, addClass, createElement, append,
  html, css, size, on, off, classnames, removeClass, val,
  remove, hasClass, data, clientWidth, clientHeight, getBoundingClientRect,
  getQueryParam, isElementMatches, getParent, parent, formSubmit,
  removeAttribute, fillFormFromURL, insertFirstChild, resetForm, appendAfter,
  clear
};
