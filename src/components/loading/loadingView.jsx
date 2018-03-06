import React, { Component } from 'react';
import { PulseLoader } from 'react-spinners';

import './loadingView.css';

class LoadingView extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="loading-view">
        <PulseLoader
          loading={true}
          color={'#007BFF'}
          size={26}
          margin={'10px'}
        />
      </div>
    )
  }
};

export default LoadingView;
