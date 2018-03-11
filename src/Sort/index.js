import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Button from '../Button';

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

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  isSortReverse: PropTypes.bool.isRequired,
  activeSortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Sort;
