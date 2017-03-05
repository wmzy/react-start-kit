import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {createAsyncComponent} from 'react-async-component';

const Navigation = createAsyncComponent({
  resolve: () => import('./containers/Navigation')
});

export default () => <div>
  <Router basename="/navigation">
    <Route exact path="/" component={Navigation} />
  </Router>
</div>
