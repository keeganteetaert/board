import React from 'react';
import { Route, Switch } from 'react-router';
import { RouterProvider, ThemeProvider } from './providers';
import * as pages from './pages';
import DataProvider from './providers/DataProvider';

const App = () => (
  <ThemeProvider>
    <DataProvider>
      <RouterProvider>
        <Switch>
          <Route path="/" component={pages.SearchPage} />
        </Switch>
      </RouterProvider>
    </DataProvider>
  </ThemeProvider>
);

export default App;
