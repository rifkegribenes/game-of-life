import React from 'react';
// import PropTypes from 'prop-types';

import Board from './containers/Board';

const App = () => (
  <main>
    <h1>Game of Life</h1>
    <canvas id="board" width="720" height="540" />
    <Board />
  </main>
    );

export default App;
