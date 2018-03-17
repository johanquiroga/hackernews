import React from 'react';
import Loading from '../Loading';
import Alert from '../Alert';
import Button from '../Button';

export const withLoading = (Component) => (props) =>
  <div>
    <Component { ...props } />

    <div className="interactions">
      {props.isLoading && <Loading />}
    </div>
  </div>

export const withPaginated = (Component) => (props) =>
  <div>
    <Component {...props} />

    <div className="interactions">
      {
        (props.page !== null && !props.isLoading && props.error) &&
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

export const withInfiniteScroll = (Component) =>
  class WithInfiniteScroll extends React.Component {
    componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }

    onScroll = () => {
      if (
        (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
        this.props.list.length &&
        !this.props.isLoading &&
        !this.props.error
      ) {
        this.props.onPaginatedSearch();
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

export const withError = (Component) => ({error, ...rest}) =>
  error
  ? <Alert msg="Something went wrong!" />
  : <Component { ...rest } />
