import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App, {
  updateSearchTopStoriesState,
  updateDismissState
} from './index.js';

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
