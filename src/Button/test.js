import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { compose } from 'recompose';

import Button from './index.js';
import Loading from '../Loading';
import { withLoading } from '../HOC';

import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSpinner, faSort, faSortUp, faSortDown } from '@fortawesome/fontawesome-free-solid';

Enzyme.configure({ adapter: new Adapter() });

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

describe('ButtonWithLoading', () => {
  const props = {
    onClick() {console.log('Button clicked')}
  };

  const ButtonWithLoading = compose(
    withLoading
  )(Button);

  it('renders button without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ButtonWithLoading isLoading={false} {...props}>More</ButtonWithLoading>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders Loading without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ButtonWithLoading isLoading={true} {...props}>More</ButtonWithLoading>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('mounts a Button Component', () => {
    const component = mount(<ButtonWithLoading isLoading={false} {...props}>More</ButtonWithLoading>);
    expect(component.find(Button).length).toBe(1);
  });

  it('mounts a Loading Component', () => {
    const component = mount(<ButtonWithLoading isLoading={true} {...props}>More</ButtonWithLoading>);
    expect(component.find(Loading).length).toBe(1);
  });

  test('has a valid button snapshot', () => {
    const component = renderer.create(<ButtonWithLoading isLoading={false} {...props}>More</ButtonWithLoading>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('has a valid loading snapshot', () => {
    const component = renderer.create(<ButtonWithLoading isLoading={true} {...props}>More</ButtonWithLoading>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
