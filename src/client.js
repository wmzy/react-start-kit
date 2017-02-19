/**
 * Created by wmzy on 16-6-15.
 */

import React from 'react';
import {render} from 'react-dom'
import {Router, Route, Link, browserHistory} from 'react-router'
import routes from './routes';

render(<Router history={browserHistory} routes={routes}/>, document.getElementById('app'));

if (module.hot) {
	module.hot.accept('./routes', () => {
		render(<Router history={browserHistory} routes={routes}/>, document.getElementById('app'));
	});
}
