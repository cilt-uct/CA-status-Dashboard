import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import heirarchy from './heirarchy.js'
import * as config from './config.json';
import * as ca_names from './caNames.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import './App.css';

class App extends Component { 

  state = {
    agents: [],
    filteredAgents: [],
    venues: [],
    statuses: [],
    venueSelected: "all",
    statusSelected: "all",
    sort: "",
  }
  
  async componentDidMount() {

    try {

      await this.updateCAs()

      setInterval(async () => {
        await this.updateCAs();
      }, 60000);

    } catch(e) {
      console.log(e);
    }
  }

  async updateCAs() {
    var agents = [];

    var requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    await fetch(config.agent_endpoint, requestOptions)
      .then(response => response.text())
      .then(result => {agents = JSON.parse(result)})
      .catch(error => console.log('error', error));
    
    var all_venues = [];

    agents.results.forEach((result) => {
      all_venues.push(result.Name);
    });

    agents.results.sort(function (a,b){
      const statusA = Object.keys(heirarchy)[Object.values(heirarchy).indexOf(a.Status)]
      const statusB = Object.keys(heirarchy)[Object.values(heirarchy).indexOf(b.Status)]
      return statusA - statusB
    });

    this.setState({
      agents: agents,
      filteredAgents: agents.results,
      venues: all_venues,
    });
  }

  onSort(event, sortKey){
    const data = this.state.filteredAgents;
    var currentSort = this.state.sort;

    if(currentSort === "" || currentSort === "asc") {
      data.sort((a,b) => a[sortKey].localeCompare(b[sortKey]))
      this.setState({sort: "desc"})
    }

    if(currentSort === "desc") {
      data.sort((a,b) => b[sortKey].localeCompare(a[sortKey]))
      this.setState({sort: "asc"})
    }

    this.setState({data})
  }

  handleVenueChange(e) {
    const selectedVenue = e.target.value;

    const filtered = selectedVenue === "all"? []: this.state.agents.results.filter(function(item){
        return item.Name === selectedVenue;
      }).map(function(item){
        return item;
      });
    
    this.setState({
      filteredAgents: selectedVenue === "all"? this.state.agents.results: filtered,
    })
  }

  handleClear() {    
    this.setState({
      filteredAgents: this.state.agents.results,
    })
  }

  normaliseStatus(status) {
    var splitStatus = status.split(".");
    return splitStatus[2].charAt(0) + splitStatus[2].slice(1).toLowerCase()
  }
  
  normaliseDate(date) {
    var d = new Date(date);
    return d.toDateString() + " " + d.toLocaleTimeString();
  }

  render () {
    return (
      <div className="App">
        <Navbar id="" bg="light" expand="lg" sticky="top">
          <Navbar.Brand href="/"> 
            <Image id="uct-logo" src="images/UCT_high_res.gif" width="300"/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"/>
            <Form> 
              {/* <Button onClick={this.updateCAs.bind(this)}>Refresh</Button> */}
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <div className="wrapper">
          <Container className="mt-3">
            <Form>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="venues">
                    <Form.Label column sm="2" className="mt-3">Venues</Form.Label>
                    <Col sm="7" className="mt-3">
                      <Form.Control as="select" onChange={this.handleVenueChange.bind(this)}>
                        <option value="all">All</option>
                        {this.state.venues.map((venue) => (
                          <option key={venue} value={venue}>{ca_names.default[venue]? ca_names.default[venue]: venue}</option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col sm="3" className="mt-3">
                      <Button onClick={this.handleClear.bind(this)} block>Clear</Button>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>  
            </Form>
          
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="pointer" onClick={e => this.onSort(e, 'Name')}>
                    <Row>
                      <Col>
                        Name 
                      </Col>
                      <Col className="right-icon">
                        <FontAwesomeIcon icon={faSort} />
                      </Col>
                    </Row>
                  </th>
                  <th className="pointer" onClick={e => this.onSort(e, 'Status')}>
                    <Row>
                      <Col>
                        Status 
                      </Col>
                      <Col className="right-icon">
                        <FontAwesomeIcon icon={faSort} />
                      </Col>
                    </Row>
                  </th>
                  <th className="pointer" onClick={e => this.onSort(e, 'Update')}>
                    <Row>
                      <Col>
                        Updated
                      </Col>
                      <Col className="right-icon">
                        <FontAwesomeIcon icon={faSort} />
                      </Col>
                    </Row>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.state.filteredAgents.map((row, index) => (
                  <tr key={index}>
                    <td>{ca_names.default[row.Name]? ca_names.default[row.Name]: row.Name}</td>
                    <td>
                      <Row>
                        <Col>
                          {this.normaliseStatus(row.Status)}
                        </Col>
                        <Col>
                          <svg height="20" width="20" class="blinking">
                            {row.Status === "AGENTS.STATUS.CAPTURING"?
                              <circle cx="10" cy="10" r="10" fill="red" />
                              : <></>
                            }
                          </svg>
                        </Col>
                      </Row>
                    </td>
                    <td>{this.normaliseDate(row.Update)}</td>
                  </tr>
                ))}
              </tbody>
            </Table> 
          </Container>
          <Row className="footer">
            <Col/>
            <Col className="mt-5 mb-5">
              @ Univerity of Cape Town. All rights reserved.
            </Col>
            <Col/>
          </Row>
        </div>
      </div>
    );
  }
}


export default App;
