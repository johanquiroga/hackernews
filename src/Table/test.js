import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { compose } from 'recompose';

import Alert from '../Alert';
import Table from './index.js';
import { withError } from '../HOC';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSpinner, faSort, faSortUp, faSortDown } from '@fortawesome/fontawesome-free-solid';

Enzyme.configure({ adapter: new Adapter() });

describe('TableWithError', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 2, points: 1, objectID: 'z' },
    ],
    sortKey: 'NONE',
    isSortReverse: false,
    onSort() {console.log(sorting)},
    onDismiss(id) {console.log('Item with objectID ' + id + ' dismissed!')}
  };

  const TableWithError = compose(
    withError
  )(Table);

  it('renders Table without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TableWithError error={false} {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders Error without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TableWithError error={true} {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('mounts a Table Component', () => {
    const component = mount(<TableWithError error={false} {...props} />);
    expect(component.find(Table).length).toBe(1);
  });

  it('mounts an Error Component', () => {
    const component = mount(<TableWithError error={true} {...props} />);
    expect(component.find(Alert).length).toBe(1);
  });

  test('has a valid Error snapshot', () => {
    const component = renderer.create(<TableWithError error={true} {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('has a valid Table snapshot', () => {
    const component = renderer.create(<TableWithError error={false} {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Table', () => {
  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
      { title: '2', author: '2', num_comments: 2, points: 1, objectID: 'z' },
    ],
    onDismiss(id) {console.log('Item with objectID ' + id + ' dismissed!')}
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table { ...props } />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('shows to items in list', () => {
    const element = shallow(<Table { ...props } />);
    expect(element.find('.table-row').length).toBe(2);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Table { ...props } />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
