import React from 'react';
import {render} from 'react-dom'
import {withAsyncComponents} from 'react-async-component';
import App from './modules/core/containers/App';


withAsyncComponents(<App />)
  .then(({appWithAsyncComponents}) => {
    render(appWithAsyncComponents, document.getElementById('app'));
  });

if (module.hot) {
	module.hot.accept('./modules/core/containers/App', () => {
    withAsyncComponents(<App />)
      .then(({appWithAsyncComponents}) => {
        render(appWithAsyncComponents, document.getElementById('app'));
      });
	});
}
