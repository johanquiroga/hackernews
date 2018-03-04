import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, { Search, Button, Table } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

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

describe('Button', () => {
  const props = {
    className: 'button',
    onClick() {console.log('Button clicked')}
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button { ...props }>Give me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('sets the given class', () => {
    const element = render(<Button { ...props }>Give me More</Button>);
    expect(element.is('.button')).toBe(true);
  });

  it('sets the correct child', () => {
    const element = render(<Button { ...props }>Give me More</Button>);
    expect(element.text()).toEqual('Give me More');
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Button { ...props }>Give me More</Button>);
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
