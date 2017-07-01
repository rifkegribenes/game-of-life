import React from 'react';
// import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Route,
  Link,
} from 'react-router-dom';

import Home from './containers/Home';
import About from './containers/About';

const App = () => (
  <BrowserRouter>
    <main>
      <h1>hello world!</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </main>
  </BrowserRouter>
    );

export default App;
