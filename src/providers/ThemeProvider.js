import React from 'react';
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core';
import PropTypes from 'prop-types';

const Provider = ({ children }) => {
  const ot = createMuiTheme();

  const theme = createMuiTheme({
    palette: {
      primary: { main: 'rgb(40,40,40)' },
    },
    shadows: [
      '0 0 10px rgba(0,0,0,0.1)',
      ...ot.shadows.slice(1), // TODO
    ],
    shape: {
      borderRadius: 12,
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            overflowX: 'hidden',
          },
        },
      },
      MuiSlider: {
        markLabel: {
          fontSize: '10px',
        },
        root: {
          width: 'calc(100% - 10px)',
          marginLeft: '5px',
        },
      },
      MuiChip: {
        labelSmall: {
          fontSize: '10px',
        },
      },
      MuiDrawer: {
        paperAnchorBottom: {
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
      },
    },
    props: {
      MuiTextField: {
        InputLabelProps: { shrink: true },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
