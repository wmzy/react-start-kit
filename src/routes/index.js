/**
 * 路由
 * Created by wmzy on 16-6-15.
 */


import React from 'react'
import {Router, Route, Link, browserHistory} from 'react-router'
import App from '../components/app';

export default (
	<Router history={browserHistory}>
		<Route path="/(index.html)" component={App}>
			{
				/*
				 <Route path="about" component={About}/>
				 <Route path="users" component={Users}>
				 <Route path="/user/:userId" component={User}/>
				 </Route>
				 <Route path="*" component={NoMatch}/>
				 */
			}
		</Route>
	</Router>
);
