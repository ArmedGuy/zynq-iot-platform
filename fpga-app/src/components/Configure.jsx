import React, { Component } from 'react';
import { Grid, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {Doughnut,Line} from 'react-chartjs-2';
import './Configure.css';

export default class Configure extends Component {
  constructor() {
    super()
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      key: 0,
      devices: [],
      doughnut: doughnutData()
    };
  }

  componentDidMount() {
    document.title = "Configure - FPGA WebApp";
    window.scrollTo(0,0)

    fetch('http://localhost:8080/api/getDevice/'+this.props.match.params.id, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({ devices: data }))

    setInterval(() => {
      this.setState(state => ({
        doughnut: doughnutData()
      }));
    }, 5000);
  }

  onDrop(files) {
    var key = this.state.key
    var formData = new FormData()
    files.forEach(file => {
      formData.append('file', file)
    })
    //formData.append('file', files[0])
    fetch('http://localhost:8080/api/configure/'+key, {
      method: 'POST',
      body: formData
    })
  }

  handleSelect(key) {
    this.setState({ key });
  }

  render () {
    return (
      <div className="content">
        <Grid className="content-container">
          <Row>
            <Col md={12}>
              <Tabs activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey={0} title="Stats" className="tab-content-stats">
                  <Row>
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
                    <Col xs={12} sm={12} md={3}>
                      <div className="col-container container-small">
                        <div>
                          <h2 className="dashboard-header">Doughnut Example</h2>
                          <Doughnut data={this.state.doughnut} />
                        </div>
                      </div>
                    </Col>
                  {this.state.devices.id + " " + this.state.devices.status + " " + this.state.devices.model + " " + this.state.devices.cpu + " " + this.state.devices.ram}
                </Tab>
                <Tab eventKey={1} title="Flash" className="tab-content-dropzone">
                  <Dropzone className="dropzone" onDrop={this.onDrop.bind(this)}>
                    <h1>Here you can upload runnable files straight to the device!</h1>
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drop some files here, or click to select files to upload.</p>
                  </Dropzone>
                </Tab>
              </Tabs>
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