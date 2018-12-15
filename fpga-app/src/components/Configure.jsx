import React, { Component } from 'react';
import { Grid, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {Doughnut,Line} from 'react-chartjs-2';
import './Dashboard.css';
import './Configure.css';

export default class Configure extends Component {
  constructor() {
    super()
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      key: 0,
      devices: [],
      stats: [],
      stdout: "",
      stderr: ""
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

    fetch('http://localhost:8080/api/getStats/'+this.props.match.params.id, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({ stats: data }))

    setInterval(() => {
      fetch('http://localhost:8080/api/getOutput/'+this.props.match.params.id, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => this.setState({ stdout: data.stdout, stderr: data.stderr }))
    }, 2000);
  }

  onDrop(files) {
    var key = this.state.key
    var formData = new FormData()
    files.forEach(file => {
      formData.append('file', file)
    })
    //formData.append('file', files[0])
    fetch('http://localhost:8080/api/configure/'+this.props.match.params.id, {
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
                  <Row className="stats-row" style={{"padding-bottom": "0px"}}>
                    <Col xs={12} sm={12} md={3}>
                      <div className="col-container container-small">
                        <div>
                          <h2 className="dashboard-header">Device Status</h2>
                          <p className={"device-stats "+ this.state.devices.status}>{this.state.devices.status}</p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={3}>
                      <div className="col-container container-small">
                        <div>
                          <h2 className="dashboard-header">Device Model</h2>
                          <p className="device-stats">{this.state.devices.model}</p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={3}>
                      <div className="col-container container-small">
                        <div>
                          <h2 className="dashboard-header"># of CPUs</h2>
                          <p className="device-stats">{this.state.devices.cpu}</p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={3}>
                      <div className="col-container container-small">
                        <div>
                          <h2 className="dashboard-header"># of RAM</h2>
                          <p className="device-stats">{this.state.devices.ram} Mb</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="stats-row" style={{"padding-top": "0px", "padding-bottom": "0px"}}>
                    <Col xs={12} sm={12} md={6}>
                      <div className="col-container">
                        <div>
                          <h2 className="dashboard-header">CPU/RAM Historical Data</h2>
                          <Line data={resourceData} options={resourceOptions} />
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                      <div className="col-container">
                        <div>
                          <h2 className="dashboard-header">Network Up/Down Historical Data</h2>
                          <Line data={netData} options={netOptions} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey={1} title="Output" className="tab-content-stats">
                  <Row className="stats-row">
                    <Col xs={12} sm={12} md={6}>
                      <div className="col-container">
                        <div>
                          <h2 className="dashboard-header">STDOut Output</h2>
                          <pre>{this.state.stdout}</pre>
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                      <div className="col-container">
                        <div>
                          <h2 className="dashboard-header">STDErr Output</h2>
                          <pre>{this.state.stderr}</pre>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey={2} title="Flash" className="tab-content-dropzone">
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

const resourceData = {
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

const netData = {
  labels: ['-30', '-25', '-20', '-15', '-10', '-5', 'Now'],
  datasets: [
    {
      label: 'Up',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(255, 99, 132, 0.4)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(255, 99, 132, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [5, 20, 35, 50, 65, 80, 95]
    },
    {
      label: 'Down',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(99, 249, 112, 0.4)',
      borderColor: 'rgba(99, 249, 112, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(99, 249, 112, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(99, 249, 112, 1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [95, 80, 65, 50, 35, 20, 5]
    }
  ]
};

const resourceOptions = {
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Time (s)'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Usage (%)'
      }
    }]
  }
};

const netOptions = {
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Time (s)'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Speed (Mb/s)'
      }
    }]
  }
};