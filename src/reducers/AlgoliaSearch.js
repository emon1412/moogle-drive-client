import { ACTIONS } from '../Constants';

const getInitialState = () => ({});

const _createSearchStateByPage = (pageName, initialState) => ({
  [pageName]: {
    isInitialized: true,
    isAlgoliaLoading: false,
    query: '',
    noResults: false,
    defaultFilter: '',
    filters: {
      // [field]: <Object>{ isApplied: <Bool>, type: 'INCLUDE' || 'EXLUDE'}
      // [field]: <String>
      // [field]: true
    },
    searchResults: {},
    ...initialState,
  },
});

export default (state = getInitialState(), action) => {
  let newQuery;
  let newFilters;
  let newIndices;
  let newSearchResults;
  switch (action.type) {
    case ACTIONS.ALGOLIA_STATE_INIT: {
      const { pageName, initialState } = action.payload;
      return {
        ...state,
        ..._createSearchStateByPage(pageName, initialState),
      };
    }
    case ACTIONS.ALGOLIA_SEARCH_START: {
      const { pageName, query } = action.payload;

      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          isAlgoliaLoading: true,
          query,
        },
      };
    }

    case ACTIONS.ALGOLIA_SEARCH_SUCCESS: {
      const { searchResults, pageName, indexName } = action.payload;
      newSearchResults = {
        ...state[pageName].searchResults,
        ...searchResults,
      };

      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          searchResults: newSearchResults,
          isAlgoliaLoading: false,
          noResults: (searchResults[indexName] || []).length === 0,
        },
      };
    }

    case ACTIONS.UPDATE_ALGOLIA_SEARCH_FILTERS: {
      const { filters, pageName } = action.payload;

      // IMPORTANT: overwrite
      newFilters = {
        ...filters,
      };

      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          filters: newFilters,
        },
      };
    }

    case ACTIONS.UPDATE_ALGOLIA_SEARCH_INDICES: {
      const { indices, pageName } = action.payload;

      // IMPORTANT: overwrite
      newIndices = {
        ...indices,
      };
      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          indices: newIndices,
        },
      };
    }

    case ACTIONS.UPDATE_ALGOLIA_SEARCH_QUERY: {
      const { query, pageName } = action.payload;
      newQuery = query;
      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          query: newQuery,
        },
      };
    }

    case ACTIONS.CLEAR_ALGOLIA_SEARCH_RESULT: {
      const { pageName } = action.payload;

      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          searchResults: {},
          isAlgoliaLoading: false,
          noResults: false,
        },
      };
    }

    default:
      return state;
  }
};
