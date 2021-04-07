import { Tooltip } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const ValueLabel = ({ children, open, value }) => (
  <Tooltip
    arrow
    open={open}
    enterTouchDelay={0}
    placement="top"
    title={value}
  >
    {children}
  </Tooltip>
);

ValueLabel.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired,
};

export default ValueLabel;
