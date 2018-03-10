import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {
  Search,
  Button,
  ButtonWithLoading,
  Loading,
  Table,
  TableWithError,
  Alert,
  updateSearchTopStoriesState,
  updateDismissState
} from './App';

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

describe('ButtonWithLoading', () => {
  const props = {
    onClick() {console.log('Button clicked')}
  };

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
    sortKey: 'NONE',
    isSortReverse: false,
    onSort() {console.log(sorting)},
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

describe('updateSearchTopStoriesState', () => {
  const prevState = {
    searchKey: 'test',
    results: {
      test: {
        hits: [
          { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
          { title: '2', author: '2', num_comments: 2, points: 1, objectID: 'z' },
        ],
        page: 1
      }
    }
  };

  it('updates state with new results from search action', () => {
    const newHits = {
      hits: [
        { title: '3', author: '3', num_comments: 1, points: 2, objectID: 'x' }
      ],
      page: 2
    };

    const newState = updateSearchTopStoriesState(newHits.hits, newHits.page)(prevState);

    expect(newState.results['test'].hits).toEqual([...prevState.results['test'].hits, ...newHits.hits]);
    expect(newState.results['test'].page).toEqual(newHits.page);
  });
});

describe('updateDismissState', () => {
  const prevState = {
    searchKey: 'test',
    results: {
      test: {
        hits: [
          { title: '1', author: '1', num_comments: 1, points: 2, objectID: 'y' },
          { title: '2', author: '2', num_comments: 2, points: 1, objectID: 'z' },
        ],
        page: 1
      }
    }
  };

  it('updates state discarding dismissed item', () => {
    const dismissedObjectID = 'y';

    const newState = updateDismissState(dismissedObjectID)(prevState);

    expect(
      newState.results['test'].hits.filter(
        (item) => item.objectID === dismissedObjectID
      ).length
    ).toBe(0);
  });
});
