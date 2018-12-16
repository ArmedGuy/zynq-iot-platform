import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import {Doughnut,Line} from 'react-chartjs-2';
import './Dashboard.css';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configFPGA1: "",
      configFPGA2: "",
      seconds: 0,
      doughnut: doughnutData()
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
    
    fetch('http://localhost:8080/api/current', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({
      configFPGA1: data.response["FPGA1"],
      configFPGA2: data.response["FPGA2"]
    }))

    var ProgressBar = require('progressbar.js')
    var cpuBar = new ProgressBar.Circle('#cpu', {
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
      from: { color: '#FF6384', width: 3 },
      to: { color: '#FF6384', width: 4 },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
    
        var value = Math.round(circle.value() * 100);
        circle.setText('CPU Usage: ' + value + '%');
      }
    });

    var memBar = new ProgressBar.Circle('#mem', {
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
      from: { color: '#36A2EB', width: 3 },
      to: { color: '#36A2EB', width: 4 },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);
    
        var value = Math.round(circle.value() * 100);
        circle.setText('MEM Usage: ' + value + '%');
      }
    });

    cpuBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    cpuBar.text.style.fontSize = '1.5rem';
    memBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    memBar.text.style.fontSize = '1.5rem';

    cpuBar.animate(0.5)
    memBar.animate(1)

    setInterval(() => {
      this.setState(state => ({
        doughnut: doughnutData()
      }));
    }, 5000);
    //this.interval = setInterval(() => this.tick(bar), 1000);
  }
  render () {
    return (
      <div className="content">
        <Grid className="content-container">
          <Row>
            <Col xs={12} sm={12} md={6}>
              <div className="col-container container-small">
                <h2 className="dashboard-header">Resource Utilization</h2>
                <Row>
                  <Col xs={12} sm={12} md={6} className="progressbar-col">
                    <div id="cpu" className="progressbar-container"></div>
                  </Col>
                  <Col xs={12} sm={12} md={6} className="progressbar-col">
                    <div id="mem" className="progressbar-container"></div>
                  </Col>
                </Row>
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
                  <Doughnut data={this.state.doughnut} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <div className="col-container">
                <div>
                  <h2 className="dashboard-header">FPGA1 Historical Data</h2>
                  <Line data={data} />
                </div>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <div className="col-container">
                <div>
                  <h2 className="dashboard-header">FPGA2 Historical Data</h2>
                  <Line data={data} />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

const doughnutData = () => ({
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    data: [getRandomInt(50, 200), getRandomInt(100, 150), getRandomInt(150, 250)],
    backgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ],
    hoverBackgroundColor: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56'
    ]
  }]
});

const data = {
  labels: ['-30', '-25', '-20', '-15', '-10', '-5', 'Now'],
  datasets: [
    {
      label: 'CPU',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(255, 206, 86, 0.4)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(255, 206, 86, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(255, 206, 86, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 0]
    },
    {
      label: 'Memory',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(54, 162, 235, 0.4)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [35, 95, 30, 85, 20, 75, 90]
    }
  ]
};

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}