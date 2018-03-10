import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSpinner, faSort, faSortUp, faSortDown } from '@fortawesome/fontawesome-free-solid';
import './App.css';

fontawesome.library.add(faSpinner, faSort, faSortUp, faSortDown);

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, (item) => item.title.toLowerCase()),
  AUTHOR: list => sortBy(list, (item) => item.author.toLowerCase()),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};

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

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    this.setState((prevState) => {
      const { searchTerm } = prevState;
      this.fetchSearchTopStories(searchTerm);

      return { searchKey: searchTerm };
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then((result) => this._isMounted && this.setSearchTopStories(result.data))
      .catch((error) => this._isMounted && this.setState({ error, isLoading: false }));
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    event.preventDefault();
    this.setState((prevState) => {
      const { searchTerm } = prevState;

      if (this.needsToSearchTopStories(searchTerm)) {
        this.fetchSearchTopStories(searchTerm);
      }

      return { searchKey: searchTerm };
    });
  }

  onDismiss(id) {
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
        <TableWithError
          error={error}
          list={list}
          onDismiss={this.onDismiss}
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { children, value, onChange, onSubmit } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => { this.input = node; }}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

Search.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    this.setState((prevState) => {
      const isSortReverse = prevState.sortKey === sortKey && !prevState.isSortReverse;

      return { sortKey, isSortReverse };
    });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{width: '40%' }}>
            <Sort
              sortKey={'TITLE'}
              isSortReverse={isSortReverse}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
          </span>
          <span style={{width: '30%' }}>
            <Sort
              sortKey={'AUTHOR'}
              isSortReverse={isSortReverse}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={{width: '10%' }}>
            <Sort
              sortKey={'COMMENTS'}
              isSortReverse={isSortReverse}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span style={{width: '10%' }}>
            <Sort
              sortKey={'POINTS'}
              isSortReverse={isSortReverse}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            Archive
          </span>
        </div>
        {reverseSortedList.map((item) =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%'}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%'}}>
              {item.author}
            </span>
            <span style={{ width: '10%'}}>
              {item.num_comments}
            </span>
            <span style={{ width: '10%'}}>
              {item.points}
            </span>
            <span style={{ width: '10%'}}>
              <Button
                onClick={() => onDismiss(item.objectID)} // <-- Higher-order functions
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Sort = ({sortKey, isSortReverse, activeSortKey, onSort, children}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  const sortIcon = sortKey === activeSortKey
    ? isSortReverse
      ? 'sort-up'
      : 'sort-down'
    : 'sort';

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children} <FontAwesomeIcon icon={sortIcon} size="xs" />
    </Button>
  );
}

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Alert = ({msg}) =>
  <div className="interactions">
    <p>{msg}</p>
  </div>

const Loading = () => <FontAwesomeIcon icon="spinner" spin />

const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
  ? <Loading />
  : <Component { ...rest } />

const withError = (Component) => ({error, ...rest}) =>
  error
  ? <Alert msg="Something went wrong!." />
  : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

const TableWithError = withError(Table);

export default App;

export {
  Button,
  Search,
  Table,
  ButtonWithLoading,
  TableWithError,
  Loading,
  Alert
};
