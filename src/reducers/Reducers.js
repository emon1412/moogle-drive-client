import { combineReducers } from 'redux';
import files from './Files';
import algoliaSearch from './AlgoliaSearch';

export default combineReducers({
  files,
  algoliaSearch,
});
