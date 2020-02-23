import toCamesCase from 'camelcase-keys';
import toSnakeCase from 'snakecase-keys';


/**
 * @param {string} url
 * @param {Object} [queryParams]
 * @return {string}
 * */
const addQueryParams = (url, queryParams) => {
  if (!queryParams) return url;

  const params = toSnakeCase(queryParams);
  const paramsList = [];

  (Object.keys(params)).forEach((key) => {
    const value = params[key];

    if (value !== null && value !== undefined) {
      paramsList.push(
        `${key}=${(Array.isArray(value) ? value.join(',') : encodeURIComponent(value))}`
      );
    }
  });

  return `${url}?${(paramsList.join('&'))}`;
};

/**
 * @param {string} method
 * @param {string} url
 * @param {Object} [data]
 * @return {string}
 * */
const formatURL = (method, url, data) => {
  if (!data) return url;

  return addQueryParams(url.replace(/:(\w+)/g, (match, param) => {
    return (
      param.length ? data[param] : data
    );
  }), method === "get" ? data : data.__query);
};


/**
 * @param {string} method
 * @param {string} url
 * */
export const requestApi = (method='post', url) => (data) => {
  method = method.toLowerCase();

  let body;
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (data && method !== 'get') {
    body = JSON.stringify(toSnakeCase(data));
  }

  return window.fetch(`/${formatURL(method, url, data)}`, {
    method, body, headers,
    credentials: "include"
  }).then(
    (response) => {
      if(response.status === 401) {

        // remove auth cookie or do other not authorized logic

        window.location = '/';

        return;
      }

      if ([500, 404].indexOf(response.status) > -1) {
        return response;
      } else {
        return response.json().then((json) => {
          return toCamesCase(json, {
            deep: true,
            exclude: []
          });
        });
      }
    }
  );
};

export const apiRules = {
  'newsletter.subscribe': requestApi('post', 'newsletter/'),
  'topic.search': requestApi('get', 'search-topic/'),
  'comments.search': requestApi('get', 'api/search-comments/'),
  'comments.filter': requestApi('get', 'api/filter-comments/'),
  'pulse.get': requestApi('get', 'api/get-pulse/'),
  'pulse.videos.get': requestApi('get', 'api/get-pulse-videos/'),
  'roulette.random-link.get': requestApi('get', 'api/get-roulette-link/'),
};

/**
 * @param {string} ruleId
 * @param {(Object|null|undefined)} data
 * */
export function request(ruleId, data) {
  return apiRules[ruleId](data);
}

export const api = {

  /**
   * @param {string} formCSSQuery
   * @param {string} ruleId
   * @param {Function} cb
   * @param {Function} processFormData
   * */
  withForm: (formCSSQuery, ruleId, cb, processFormData) => {
    $.formSubmit(formCSSQuery, (formData, $form, event) => {
      event.preventDefault();

      if (_.isFunction(processFormData)) {
        formData = processFormData(formData, $form, event);
      }

      return request(ruleId, formData).then((response) => {
        const { error } = response;

        if (error || response.status === 500) {
          window.__handleError($form, error, response).then(($alert) => {
            $.css($alert, {
              "margin-bottom": "10px"
            })
          });
        } else {
          $.remove(".alert", $form);
        }

        cb(response, $form, event);
      });
    });
  },
  request
};