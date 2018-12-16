import React, { Component } from 'react';
import './NoMatch404.css';

export default class NoMatch404 extends Component {
  componentDidMount() {
    document.title = "404 Not Found - FPGA WebApp";
    window.scrollTo(0,0)
  }
  render () {
    return (
      <div className="content">
        <div className="error-404">
          <h1 className="title-404">404</h1>
          <h2 className="subtitle-404">Page Not Found</h2>
          <h2 className="subtitle-404">Looks like you've taken a wrong turn!</h2>
        </div>
      </div>
    )
  }
}