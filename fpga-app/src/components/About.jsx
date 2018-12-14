import React, { Component } from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import './About.css';

export default class About extends Component {
  componentDidMount() {
    document.title = "About - FPGA WebApp";
    window.scrollTo(0,0)
  }
  render () {
    return (
      <div className="content">
        <Grid className="content-container">
          <Row>
            <Col md={12}>
              <div className="about-panel">
                <div className="about-content">
                  <h1 className="about-header">
                    About the Project 
                  </h1>
                  <p>
                    This project is centered around reconfiguring FPGAs via a front-end web application. 
                    This project is for university course M7012E - Pervasive Computing given at Luleå Tekniska Universitet.<br/><br/>

                    Technology choices: <br/>
                    React.js for front-end, Golang for Web back-end, etc etc.
                  </p>
                  <ul className="group-members">
                    <li>Emil Kitti</li>
                    <li>Johan Jatko</li>
                    <li>Jesper Öhman</li>
                  </ul>
                  <Image id="ltu-logo" src="https://www.arkitekt.se/app/uploads/2015/05/LTU.jpg" responsive />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}