import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Home from '../../components/Home';
import About from '../../components/About';
import NavigationRouters from '../../../navigation/Routers';

export default () => (<Router>
  <div>
    <Link to="/navigation">navigation</Link>
    <Route exact path="/" component={Home}/>
    <Route path="/about" component={About}/>
    <Route path="/navigation" component={NavigationRouters}/>
  </div>
</Router>)
