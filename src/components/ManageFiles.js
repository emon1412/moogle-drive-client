import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { values, isEmpty } from 'lodash';
import {
  getManyFiles,
  updateAlgoliaSearchQuery,
  initializeAlgoliaSearchState,
  clearAlgoliaSearchResult,
  postAlgoliaSearch,
  updateAlgoliaSearchFilters,
} from '../actions/index';
import SearchTextInput from './SearchTextInput';
import FilesTable from './FilesTable';
import MultiSelectTextInput from './MultiSelectTextInput';

class ManageFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedReviewContentItems: {},
      noResults: false,
      searchQuery: '',
    };
    this.algoliaIndex = 'FilesMetadata';
    this.pageName = 'ManageFiles';
  }

  componentDidMount() {
    const { getManyFiles, initializeAlgoliaSearchState } = this.props;

    initializeAlgoliaSearchState({
      pageName: this.pageName,
      initialState: {
        indices: this.algoliaIndex,
        filters: {},
      },
    });

    return getManyFiles();
  }

  clearAlgoliaSearchQuery = () => {
    const { clearAlgoliaSearchResult, updateAlgoliaSearchQuery, algoliaSearch, postAlgoliaSearch } = this.props;

    updateAlgoliaSearchQuery({
      pageName: this.pageName,
      query: '',
    });
    this.setState({
      searchQuery: '',
    });

    if (isEmpty(algoliaSearch.filters || {})) {
      clearAlgoliaSearchResult({ pageName: this.pageName });
    } else {
      console.log('got here');
      return postAlgoliaSearch({
        pageName: this.pageName,
        query: '',
        indexName: 'FilesMetadata',
        filters: algoliaSearch.filters,
        customSearchParams: {
          hitsPerPage: 1000,
        },
      });
    }
  };

  postAlgoliaSearch = () => {
    const { postAlgoliaSearch, updateAlgoliaSearchQuery, algoliaSearch } = this.props;
    const { searchQuery } = this.state;
    updateAlgoliaSearchQuery({
      pageName: this.pageName,
      query: searchQuery,
    });

    return postAlgoliaSearch({
      pageName: this.pageName,
      query: searchQuery,
      indexName: 'FilesMetadata',
      filters: algoliaSearch.filters,
      customSearchParams: {
        hitsPerPage: 1000,
      },
    });
  };

  _onSearchQueryChange = e => {
    this.setState({
      searchQuery: e.target.value,
    });
  };

  _onFilterChange = (value, filterName, actionMeta) => {
    const {
      clearAlgoliaSearchResult,
      updateAlgoliaSearchFilters,
      postAlgoliaSearch,
      searchQuery = '',
      algoliaSearch = {},
    } = this.props;
    const newFilters = { ...(algoliaSearch.filters || {}) };

    if (actionMeta.action === 'clear' || (actionMeta.action === 'remove-value' && isEmpty(value))) {
      delete newFilters[filterName];
    } else {
      value.forEach(item => {
        if (!newFilters[filterName]) {
          newFilters[filterName] = {};
        }
        newFilters[filterName][item.value] = { isApplied: true, type: 'INCLUDE' };
      });
    }
    console.log(newFilters, 'newFilters');

    updateAlgoliaSearchFilters({
      pageName: this.pageName,
      filters: newFilters,
    });

    if (!searchQuery.length && isEmpty(newFilters)) {
      return clearAlgoliaSearchResult({
        pageName: this.pageName,
      });
    }

    return postAlgoliaSearch({
      pageName: this.pageName,
      query: searchQuery,
      indexName: 'FilesMetadata',
      filters: newFilters,
      customSearchParams: {
        hitsPerPage: 1000,
      },
    });
  };

  render() {
    const { history, files, algoliaSearch = {}, searchResult } = this.props;
    const { searchQuery } = this.state;

    const shouldDisplaySearchResult =
      !isEmpty(searchResult) || (isEmpty(searchResult) && (algoliaSearch.query || !isEmpty(algoliaSearch.filters)));
    return (
      <div id={'manage-files'}>
        <h3>Manage Files</h3>
        <div className={'controls-row'}>
          <Button variant={'outline-primary'} onClick={() => history.push('/newfile')}>
            ADD FILE
          </Button>
          <SearchTextInput
            onChange={this._onSearchQueryChange}
            value={searchQuery}
            onSubmit={this.postAlgoliaSearch}
            onClear={this.clearAlgoliaSearchQuery}
            placeholder={`Search name, tags or extension...`}
          />
        </div>
        <div className={'tags-filters-row row'}>
          <MultiSelectTextInput
            onChange={(value, actionMeta) => {
              this._onFilterChange(value, 'tags', actionMeta);
            }}
            placeholder={'Add a tag and press enter...'}
            className={'col-6'}
          />
          <MultiSelectTextInput
            onChange={(value, actionMeta) => {
              this._onFilterChange(value, 'extension', actionMeta);
            }}
            placeholder={'Add an extension and press enter...'}
            className={'col-6'}
          />
        </div>
        <FilesTable files={shouldDisplaySearchResult ? searchResult : files} history={history} />
        {shouldDisplaySearchResult && algoliaSearch.noResults ? (
          <div className={'no-results-msg'}>No result.</div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { files, algoliaSearch = {} } = state;

  return {
    files: values(files.byId),
    algoliaSearch: algoliaSearch.ManageFiles,
    searchResult: algoliaSearch?.ManageFiles?.searchResults.FilesMetadata || [],
  };
};

const mapDispatchToProps = dispatch => ({
  getManyFiles: params => dispatch(getManyFiles(params)),
  initializeAlgoliaSearchState: params => dispatch(initializeAlgoliaSearchState(params)),
  updateAlgoliaSearchQuery: params => dispatch(updateAlgoliaSearchQuery(params)),
  clearAlgoliaSearchResult: params => dispatch(clearAlgoliaSearchResult(params)),
  postAlgoliaSearch: params => dispatch(postAlgoliaSearch(params)),
  updateAlgoliaSearchFilters: params => dispatch(updateAlgoliaSearchFilters(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageFiles));
