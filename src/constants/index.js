import { sortBy } from 'lodash';

export const DEFAULT_QUERY = 'redux';
export const DEFAULT_HPP = '20';

export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = 'hitsPerPage=';

export const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, (item) => item.title.toLowerCase()),
  AUTHOR: list => sortBy(list, (item) => item.author.toLowerCase()),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};

export const getHackerNewsUrl = (value, page) =>
  `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${value}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;

export const loadingCondition = (props) =>
  props.isLoading;

export const paginatedCondition = (props) =>
  props.page !== null && !loadingCondition(props) && errorCondition(props);

export const infiniteScrollCondition = (props) =>
  (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
  && props.list.length
  && !loadingCondition(props)
  && !errorCondition(props);

export const errorCondition = (props) =>
  props.error;
