import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Sort from './index.js';
import Button from '../Button';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSpinner, faSort, faSortUp, faSortDown } from '@fortawesome/fontawesome-free-solid';

Enzyme.configure({ adapter: new Adapter() });

describe('Sort', () => {
  const props = {
    sortKey: 'NONE',
    isSortReverse: false,
    activeSortKey: 'TITLE',
    onSort() {console.log(sorting)}
  };

  it('renders Sort without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Sort {...props}>Sort</Sort>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('mounts a Sort Component', () => {
    const component = mount(<Sort {...props}>Sort</Sort>);
    expect(component.find(Sort).length).toBe(1);
  });

  it('shows sort icon', () => {
    const wrapper = shallow(<Sort {...props}>Sort</Sort>);
    expect(wrapper.find(Button).find(FontAwesomeIcon).prop('icon')).toBe('sort');
  });

  it('shows sort-down icon', () => {
    const wrapper = mount(<Sort {...props}>Sort</Sort>);
    wrapper.setProps({ activeSortKey: 'NONE' });
    expect(wrapper.find(Button).find(FontAwesomeIcon).prop('icon')).toBe('sort-down');
  });

  it('shows sort-up icon', () => {
    const wrapper = mount(<Sort {...props}>Sort</Sort>);
    wrapper.setProps({ activeSortKey: 'NONE', isSortReverse: true });
    expect(wrapper.find(Button).find(FontAwesomeIcon).prop('icon')).toBe('sort-up');
  });

  test('has a valid Sort snapshot', () => {
    const component = renderer.create(<Sort {...props}>Sort</Sort>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
