import BluebirdPromise from 'bluebird';

const getBody = response => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }
  return response.text();
};

function FetchError(response, body) {
  this.name = 'FetchError';
  this.status = response.status;
  this.message = body && body.message ? body.message : '';
  this.body = body;
}
FetchError.prototype = Error.prototype;

const checkResponseStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return getBody(response).then(body => {
    throw new FetchError(response, body);
  });
};

let store;
let headerMapper = () => {
  const headers = {};
  return headers;
};

const setReduxStore = newStore => {
  store = newStore;
};

const setHeaderMapper = newMapper => {
  headerMapper = newMapper;
};

const IsValidJSONString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const MoogleDriveFetch = (url, options = {}) => {
  let { body, headers } = options;
  const { throwOnNonSuccess = true, returnWholeResponse = false, data, mode } = options;

  return BluebirdPromise.resolve()
    .then(() => {
      if (typeof url !== 'string') {
        throw new Error("MoogleDriveFetch requires a 'url' property that is a string");
      }
      if (!IsValidJSONString(body)) {
        body = JSON.stringify(body);
      }
      const mappedHeaders = store ? headerMapper(store.getState()) : null;
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...mappedHeaders,
        ...headers,
      };
      if (data) {
        delete headers['Content-Type'];
        body = data;
      }

      // Only allowing certain headers
      const cleanedHeaders = {
        // Authorization: headers.Authorization,
        Accept: headers.Accept,
      };

      if (headers['Content-Type']) {
        cleanedHeaders['Content-Type'] = headers['Content-Type'];
      }

      const fetchOptions = {
        ...options,
        body,
        headers: cleanedHeaders,
        mode,
      };
      return fetch(url, fetchOptions);
    })
    .then(response => {
      if (throwOnNonSuccess) {
        return checkResponseStatus(response);
      }
      return response;
    })
    .then(response => {
      if (returnWholeResponse) {
        return response;
      }
      return getBody(response);
    });
};

export { setReduxStore, setHeaderMapper, FetchError, MoogleDriveFetch };
