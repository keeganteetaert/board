import React from 'react';
import { Route, Switch } from 'react-router';
import { RouterProvider, ThemeProvider } from './providers';
import * as pages from './pages';

const App = () => (
  <ThemeProvider>
    <RouterProvider>
      <Switch>
        <Route path="/" component={pages.SearchPage} />
      </Switch>
    </RouterProvider>
  </ThemeProvider>
);

export default App;
