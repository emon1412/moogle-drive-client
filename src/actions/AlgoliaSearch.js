import Config from 'config';
import algolia from 'algoliasearch';
import { ACTIONS } from '../Constants';
import { algoliaFilterStringBuilder } from '../utils/StringUtils';

const algoliaInstance = algolia(Config.algoliaAppID, Config.algoliaAPIKey);

export const initializeAlgoliaSearchState = params => {
  const { pageName, initialState } = params;
  return dispatch =>
    dispatch({
      type: ACTIONS.ALGOLIA_STATE_INIT,
      payload: {
        pageName,
        initialState,
      },
    });
};

export const postAlgoliaSearch = params => {
  const { query, indexName, filters = {}, pageName, customSearchParams, defaultFilter, typeLabels = [] } = params;
  const index = algoliaInstance.initIndex(indexName);
  return dispatch => {
    dispatch({
      type: ACTIONS.ALGOLIA_SEARCH_START,
      payload: {
        pageName,
        query,
      },
    });

    return index
      .search(query, {
        filters: algoliaFilterStringBuilder(filters, defaultFilter, typeLabels),
        ...customSearchParams,
      })
      .then(response => {
        const { hits } = response;

        dispatch({
          type: ACTIONS.ALGOLIA_SEARCH_SUCCESS,
          payload: {
            pageName,
            indexName,
            searchResults: {
              [indexName]: hits,
            },
          },
        });
        return hits;
      });
  };
};

export const updateAlgoliaSearchFilters = params => {
  const { filters, pageName } = params;
  return dispatch =>
    dispatch({
      type: ACTIONS.UPDATE_ALGOLIA_SEARCH_FILTERS,
      payload: {
        filters,
        pageName,
      },
    });
};

export const updateAlgoliaSearchIndices = params => {
  const { indices, pageName } = params;
  return dispatch =>
    dispatch({
      type: ACTIONS.UPDATE_ALGOLIA_SEARCH_INDICES,
      payload: {
        indices,
        pageName,
      },
    });
};

export const updateAlgoliaSearchQuery = params => {
  const { query, pageName } = params;
  return dispatch =>
    dispatch({
      type: ACTIONS.UPDATE_ALGOLIA_SEARCH_QUERY,
      payload: {
        query,
        pageName,
      },
    });
};

export const clearAlgoliaSearchResult = params => {
  const { pageName } = params;
  return dispatch =>
    dispatch({
      type: ACTIONS.CLEAR_ALGOLIA_SEARCH_RESULT,
      payload: {
        pageName,
      },
    });
};
