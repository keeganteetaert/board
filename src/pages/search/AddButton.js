import React from 'react';
import { Fab, Portal, useTheme } from '@material-ui/core';
import * as icons from '@material-ui/icons';
import PropTypes from 'prop-types';

const AddButton = ({ onClick }) => {
  const theme = useTheme();

  return (
    <Portal>
      <Fab
        style={{
          right: theme.spacing(2),
          bottom: theme.spacing(2),
          position: 'fixed',
        }}
        color="primary"
        size="large"
        onClick={() => onClick()}
      >
        <icons.AddRounded />
      </Fab>
    </Portal>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddButton;
