import queryString from 'query-string';

/**
 *
 * @param params
 * @param baseUrl
 * @returns {String}
 */
export const buildQueryString = (params, baseUrl) => {
  let urlToSend = baseUrl;

  if (params) {
    const localQueryObject = {};
    let itemValue;
    Object.keys(params).forEach(item => {
      itemValue = params[item];
      if (Array.isArray(itemValue)) {
        localQueryObject[item] = itemValue.join(',');
      } else {
        localQueryObject[item] = itemValue;
      }
    });

    const newQuery = queryString.stringify(localQueryObject);

    if (newQuery.length > 0) {
      urlToSend += `?${newQuery}`;
    }
  }
  return urlToSend;
};

export const algoliaFilterStringBuilder = (filtersObject, defaultFilter, typeLabels = []) => {
  let result = '';

  Object.keys(filtersObject).forEach(filterName => {
    const filter = filtersObject[filterName];
    let includeFilterString = '';
    let excludeFilterString = '';
    const filtersArray = Object.keys(filter);

    for (let i = 0; i < filtersArray.length; i += 1) {
      const subfilter = filtersArray[i];
      if (typeof filter === 'string') {
        // will take custom filter string in the case of complex range or comparison filter
        includeFilterString = `${filterName}:${filter}`;
        break;
      } else if (filter[subfilter].isApplied === true) {
        if (filter[subfilter].type === 'INCLUDE') {
          includeFilterString += `${filterName}:"${subfilter}" OR `;
          if (filterName === 'type' && typeLabels.includes(subfilter)) {
            includeFilterString += `typeLabel:"${subfilter}" OR `;
          }
        } else if (filter[subfilter].type === 'EXCLUDE') {
          excludeFilterString += `NOT ${filterName}:"${subfilter}" OR `;
        }
      }
    }

    if (includeFilterString.length) {
      if (typeof filter !== 'string') {
        includeFilterString = includeFilterString.slice(0, -4); // removing trailing 'OR'
      }

      result += `(${includeFilterString}) AND `;
    }

    if (excludeFilterString.length) {
      if (typeof filter !== 'string') {
        excludeFilterString = excludeFilterString.slice(0, -4); // removing trailing 'OR'
      }
      result += `(${excludeFilterString}) AND `;
    }
  });

  return defaultFilter ? result + defaultFilter : result.slice(0, -5); // removing trailing 'AND'
};
