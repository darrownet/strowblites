import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/app.jsx';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <AppContainer>
      <App/>
  </AppContainer>, rootEl
);

if (module.hot) {
  module.hot.accept('./components/app.jsx', () => {
    ReactDOM.render(
      <AppContainer>
          <App/>
      </AppContainer>, rootEl
    );
  });
}
