import React, { Component } from 'react';
import axios from 'axios';
import { compose } from 'recompose';
import fontawesome from '@fortawesome/fontawesome';
import { faSpinner, faSort, faSortUp, faSortDown } from '@fortawesome/fontawesome-free-solid';

import './index.css';

import Table from '../Table';
import Search from '../Search';

import { withError, withLoading, withPaginated } from '../HOC';
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP
} from '../constants';

const getHackerNewsUrl = (value, page) =>
  `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${value}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;

fontawesome.library.add(faSpinner, faSort, faSortUp, faSortDown);

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedHits = [
    ...oldHits,
    ...hits
  ];

  return {
    error: null,
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page },
    },
    isLoading: false
  };
}

const updateDismissState = (id) => (prevState) => {
  const { searchKey, results } = prevState;
  const { hits, page } = results[searchKey];

  const updatedHits = hits.filter((item) => item.objectID !== id);

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    }
  };
}

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios(getHackerNewsUrl(searchTerm, page))
      .then((result) => this._isMounted && this.setSearchTopStories(result.data))
      .catch((error) => this._isMounted && this.setState({ error, isLoading: false }));
  }

  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm];
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit = (event) => {
    event.preventDefault();

    const searchTerm = this.state.searchTerm.trim();

    if (searchTerm !== '') {
      this.setState({ searchKey: searchTerm });
      if (this.needsToSearchTopStories(searchTerm)) {
        this.fetchSearchTopStories(searchTerm);
      }
    }
  }

  onDismiss = (id) => {
    this.setState(updateDismissState(id));
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading
    } = this.state;

    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>

        <TableWithErrorWithLoadingWithPaginated
          error={error}
          list={list}
          isLoading={isLoading}
          page={page}
          onDismiss={this.onDismiss}
          onPaginatedSearch={() => this.fetchSearchTopStories(searchKey, page + 1)}
        />
      </div>
    );
  }
}

const TableWithErrorWithLoadingWithPaginated = compose(
  withPaginated,
  withLoading,
  withError
)(Table);

export default App;

export {
  updateSearchTopStoriesState,
  updateDismissState
};
