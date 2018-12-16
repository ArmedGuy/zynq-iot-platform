import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import {Doughnut} from 'react-chartjs-2';
import './Dashboard.css';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configFPGA1: "",
      configFPGA2: "",
      seconds: 0
    };
  }

  tick(bar) {
    this.setState(state => ({
      seconds: state.seconds + 1
    }));

    bar.animate(this.state.seconds / 100);  // Value from 0.0 to 1.0
  }

  componentDidMount() {
    document.title = "Dashboard - FPGA WebApp";
    window.scrollTo(0,0)
    
    fetch('http://130.240.200.99:8080/api/current', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({
      configFPGA1: data.response["FPGA1"],
      configFPGA2: data.response["FPGA2"]
    }))

    var ProgressBar = require('progressbar.js')
    var top = new ProgressBar.Circle('#top', {
      color: '#aaa',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: { color: '#666', width: 3 },
      to: { color: '#6f6', width: 4 },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
    
        var value = Math.round(circle.value() * 100);
        circle.setText('CPU Usage: ' + value + '%');
      }
    });
    top.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    top.text.style.fontSize = '1.8rem';

    var mid = new ProgressBar.Circle('#mid', {
      color: '#aaa',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: { color: '#666', width: 3 },
      to: { color: '#f66', width: 4 },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
    
        var value = Math.round(circle.value() * 100);
        circle.setText('GPU Usage: ' + value + '%');
      }
    });
    mid.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    mid.text.style.fontSize = '1.8rem';

    var bot = new ProgressBar.Circle('#bot', {
      color: '#aaa',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: { color: '#666', width: 3 },
      to: { color: '#66f', width: 4 },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
    
        var value = Math.round(circle.value() * 100);
        circle.setText('MEM Usage: ' + value + '%');
      }
    });
    bot.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bot.text.style.fontSize = '1.8rem';

    top.animate(0.33)
    mid.animate(0.66)
    bot.animate(1)
    //this.interval = setInterval(() => this.tick(bar), 1000);
  }
  render () {
    return (
      <div className="content">
        <Grid className="content-container">
          <Row>
            {/*<Col xs={12} sm={12} md={3}>
              <div className="col-container">
                <h2 className="dashboard-header">Resource Utilization</h2>
                <div id="top" className="progressbar-container"></div>
                <div id="mid" className="progressbar-container"></div>
                <div id="bot" className="progressbar-container"></div>
              </div>
            </Col>*/}
            <Col xs={12} sm={12} md={6}>
              <div className="col-container">
                <h2 className="dashboard-header">Resource Utilization</h2>
                <div id="top" className="progressbar-container"></div>
                <div id="mid" className="progressbar-container"></div>
                <div id="bot" className="progressbar-container"></div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <h2 className="dashboard-header">Current Running File</h2>
                <h2>FPGA1: {this.state.configFPGA1}</h2><br/>
                <h2>FPGA2: {this.state.configFPGA2}</h2>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <div className="col-container container-small">
                <div>
                  <h2 className="dashboard-header">Doughnut Example</h2>
                  <Doughnut data={{
                    labels: ['Red','Green','Yellow'],
                    datasets: [{
                      data: [300, 50, 100],
                      backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                      hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56']
                    }]
                  }} />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}