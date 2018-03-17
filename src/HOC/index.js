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
        (props.page !== null && !props.isLoading) &&
        <Button
          onClick={props.onPaginatedSearch}
        >
          More
        </Button>
      }
    </div>
  </div>

export const withError = (Component) => ({error, ...rest}) =>
  error
  ? <Alert msg="Something went wrong!" />
  : <Component { ...rest } />
