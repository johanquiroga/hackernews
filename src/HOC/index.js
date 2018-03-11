import React from 'react';
import Loading from '../Loading';
import Alert from '../Alert';

export const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
  ? <Loading />
  : <Component { ...rest } />

export const withError = (Component) => ({error, ...rest}) =>
  error
  ? <Alert msg="Something went wrong!" />
  : <Component { ...rest } />
