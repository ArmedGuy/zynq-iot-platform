import React, { Component } from 'react';
import { Grid, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {Line} from 'react-chartjs-2';
import './Dashboard.css';
import './Configure.css';

export default class Configure extends Component {
  constructor() {
    super()

    this.state = {
      devices: [],
      stats: [],
      historical: [],
      stdout: "",
      stderr: ""
    };
  }

  componentDidMount() {
    document.title = "Configure - FPGA WebApp";
    window.scrollTo(0,0)
    var time = Date.now()

    fetch('http://localhost:8080/api/getDevice/'+this.props.match.params.id, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({ devices: data }))

    /*fetch('http://localhost:8080/api/getStats/'+this.props.match.params.id, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({ stats: data }))*/

    this.pollingDevice = setInterval(() => {
      fetch('http://localhost:8080/api/getDevice/'+this.props.match.params.id, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => this.setState({ devices: data }))
    }, 5000);
    
    this.pollingStats = setInterval(() => {
      fetch('http://localhost:8080/api/getStats/'+this.props.match.params.id, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => updateStats.bind(this)(data))
    }, 2000);

    this.pollingOutput = setInterval(() => {
      fetch('http://localhost:8080/api/getOutput/'+this.props.match.params.id, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => this.setState({ stdout: data.stdout, stderr: data.stderr }))
    }, 2000);

    function updateStats(data) {
      var arr = this.state.stats
      let current = Math.floor((Date.now() - time)/1000).toString()
      arr.push([current, data.cpu, data.ram, data.net_up, data.net_down])
      arr = arr.slice(-7)
      console.log(arr)
      this.setState({ stats: arr })
    }
  }

  componentWillUnmount() {
    clearInterval(this.pollingDevice)
    clearInterval(this.pollingStats)
    clearInterval(this.pollingOutput)
  }

  resourceData = () => ({
    labels: this.state.stats.map(x => x[0]),
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
        data: this.state.stats.map(x => x[1])
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
        data: this.state.stats.map(x => x[2])
      }
    ]
  });

  netData = () => ({
    labels: this.state.stats.map(x => x[0]),
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
        data: this.state.stats.map(x => x[3])
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
        data: this.state.stats.map(x => x[4])
      }
    ]
  });

  onDrop(files) {
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

  render () {
    return (
      <div className="content">
        <Grid className="content-container">
          <Row>
            <Col md={12}>
              <Tabs>
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
                          <Line data={this.resourceData} options={resourceOptions} />
                        </div>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                      <div className="col-container">
                        <div>
                          <h2 className="dashboard-header">Network Up/Down Historical Data</h2>
                          <Line data={this.netData} options={netOptions} />
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