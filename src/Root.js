import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';
import App from './App';

class Root extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <BrowserRouter basename="/">
          <App store={store} />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default Root;
