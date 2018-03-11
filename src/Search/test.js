import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Search from './index.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Search', () => {
  const props = {
    value: 'redux',
    onChange(event) {console.log('Change', event)},
    onSubmit(event) {console.log('Submit', event)}
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search { ...props }>Search</Search>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Search { ...props }>Search</Search>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
