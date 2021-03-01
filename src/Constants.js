const ACTIONS_ARRAY = [
  // Algolia
  'ALGOLIA_STATE_INIT',
  'ALGOLIA_SEARCH_START',
  'ALGOLIA_SEARCH_SUCCESS',
  'UPDATE_ALGOLIA_SEARCH_FILTERS',
  'UPDATE_ALGOLIA_SEARCH_INDICES',
  'UPDATE_ALGOLIA_SEARCH_QUERY',
  'CLEAR_ALGOLIA_SEARCH_RESULT',

  // Files
  'GET_MANY_FILES',
  'POST_FILE',
  'PUT_FILE',
  'GET_FILE',
]

export const ACTIONS = (() =>
  ACTIONS_ARRAY.reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {}))();