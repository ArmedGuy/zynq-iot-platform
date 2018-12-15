import React, { Component } from 'react';
import './styles_fonts.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/CustomNavbar';
import Devices from './components/Devices';
import Configure from './components/Configure';
import About from './components/About';
import NoMatch404 from './components/NoMatch404';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Devices} />
            <Route path="/devices" component={Devices} />
            <Route path="/configure/:id" component={Configure} />
            <Route path="/about" component={About} />
            <Route component={NoMatch404} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;