/**
 * Data fetching and final component export
 *
 */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import React from 'react';
import { observer, inject, PropTypes } from 'mobx-react';

import view from './view';

// -----------------------------------------------------------------------------
// Code
// -----------------------------------------------------------------------------

class Wrapper extends React.Component {
  componentDidMount() {
    const { payments } = this.props;
    payments.get.run();
    this.polling = setInterval(() => {
      payments.get.run();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.polling);
  }

  render() {
    return React.createElement(observer(view), this.props);
  }
}

Wrapper.propTypes = {
  // payments: PropTypes.observableObject.isRequired,
};

export default inject('payments')(Wrapper);