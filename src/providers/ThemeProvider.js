import React from 'react';
import { CssBaseline, ThemeProvider, createMuiTheme } from '@material-ui/core';
import PropTypes from 'prop-types';

const Provider = ({ children }) => {
  const theme = createMuiTheme({
    palette: {
      // type: 'dark',
      primary: { main: 'rgb(40,40,40)' },
      // background: {
      //   default: 'rgb(10,10,10)',
      //   paper: 'rgb(30,30,30)',
      // },
    },
    shadows: [
      '0 0 10px rgba(0,0,0,0.1)',
    ],
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
