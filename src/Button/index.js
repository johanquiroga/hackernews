import React from 'react';
import PropTypes from 'prop-types';
import { withLoading } from '../HOC';

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;

export const ButtonWithLoading = withLoading(Button);
