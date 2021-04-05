import React from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

const history = createBrowserHistory();

const Provider = ({ children }) => (
  <Router history={history}>
    {children}
  </Router>
);

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
