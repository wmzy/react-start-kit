/**
 * 路由
 * Created by wmzy on 16-6-15.
 */


import React from 'react'
import {Router, Route, Link, browserHistory} from 'react-router'
import App from '../pages/App';
import home from './home';
import about from './about';

export default {
	path: '/',
	component: App,
	indexRoute: home,
	childRoutes: [
		about
	]
};
