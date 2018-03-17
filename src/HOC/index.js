import React from 'react';
import Loading from '../Loading';
import Alert from '../Alert';
import Button from '../Button';

export const withLoading = (conditionFn) => (Component) => (props) =>
  <div>
    <Component { ...props } />

    <div className="interactions">
      {conditionFn(props) && <Loading />}
    </div>
  </div>

export const withPaginated = (conditionFn) => (Component) => (props) =>
  <div>
    <Component {...props} />

    <div className="interactions">
      {
        conditionFn(props) &&
        <div>
          <Alert msg="Something went wrong!" />

          <Button
            onClick={props.onPaginatedSearch}
          >
            Try Again
          </Button>
        </div>
      }
    </div>
  </div>

export const withInfiniteScroll = (conditionFn) => (Component) =>
  class WithInfiniteScroll extends React.Component {
    componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () =>
      conditionFn(this.props) && this.props.onPaginatedSearch();

    render() {
      return <Component {...this.props} />;
    }
  }

export const withError = (conditionFn) => (Component) => ({error, ...rest}) =>
  error
  ? <Alert msg="Something went wrong!" />
  : <Component { ...rest } />
