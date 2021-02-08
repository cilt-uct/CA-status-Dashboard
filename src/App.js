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
import {encode} from 'base-64';
import * as loginData from './login.json';
import './App.css';

class App extends Component { 

  state = {
    gents: [],
    filteredAgents: [],
    venues: [],
    statuses: [],
    venueSelected: "all",
    statusSelected: "all",
    sort: "",
  }
  
  async componentDidMount() {

    try {

      const heirarchy = {
        1: "AGENTS.STATUS.CAPTURING",
        2: "AGENTS.STATUS.UPLOADING",
        3: "AGENTS.STATUS.IDLE",
        4: "AGENTS.STATUS.ERROR",
        5: "AGENTS.STATUS.OFFLINE",
        6: "AGENTS.STATUS.SHUTTING_DOWN",
        7: "AGENTS.STATUS.UNKNOWN",
      };

      var headers = new Headers();
      console.log(loginData.username);
      console.log(loginData.password);
      headers.set("Authorization", "Basic " + encode(loginData.username + ":" + loginData.password));

      setInterval(async () => {
        const res = fetch('https://media.uct.ac.za/admin-ng/capture-agents/agents.json', {method:'GET', headers: headers});
        const agents = await res.json();

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
      }, 60000);

    } catch(e) {
      console.log(e);
    }
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

  normaliseStatus(status) {
    var splitStatus = status.split(".");
    return splitStatus[2].charAt(0) + splitStatus[2].slice(1).toLowerCase()
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
              <Button>Refresh</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <div className="wrapper">
          <Container className="mt-3">
            <Form>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="venues">
                    <Form.Label column sm="2">Venues</Form.Label>
                    <Col sm="10">
                      <Form.Control as="select" onChange={this.handleVenueChange.bind(this)}>
                        <option value="all">All</option>
                        {this.state.venues.map((venue) => (
                          <option key={venue} value={venue}>{venue}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>  
            </Form>
          
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="pointer" onClick={e => this.onSort(e, 'Name')}>Name</th>
                  <th className="pointer" onClick={e => this.onSort(e, 'Status')}>Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.filteredAgents.map((row, index) => (
                  <tr key={index}>
                    <td>{row.Name}</td>
                    <td>{this.normaliseStatus(row.Status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table> 
          </Container>
          <Row>
            <Col>

            </Col>
            <Col>
            
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default App;
