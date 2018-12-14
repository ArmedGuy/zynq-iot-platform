import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap';
import './Devices.css';

export default class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    }
  }

  componentDidMount() {
    document.title = "Devices - FPGA WebApp";
    window.scrollTo(0,0)

    fetch('http://localhost:8080/api/getDevices', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => this.setState({ devices: data }))
  }

  render () {
    return (
      <div className="content">
        <Grid className="content-container">
          <Row>
            <Col md={12}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Model</th>
                    <th>CPUs</th>
                    <th>Memory</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.devices.map((device) =>  
                  <tr>
                    <td><a href={"/configure/"+device.name}>{device.name}</a></td>
                    <td>{device.status}</td>
                    <td>{device.model}</td>
                    <td>{device.cpu}</td>
                    <td>{device.ram}</td>
                  </tr>)}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}