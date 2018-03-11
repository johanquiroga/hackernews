import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sort from '../Sort';
import Button from '../Button';
import { withError } from '../HOC';
import { SORTS } from '../constants';

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

export const TableWithError = withError(Table);

export default Table;
