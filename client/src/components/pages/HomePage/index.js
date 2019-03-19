import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { FormControl, Card, ListGroup } from 'react-bootstrap';
import Axios from 'axios'

import './HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            topDebates: [],
            showExistingDebates: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:3001/api/arguments/topDebates', {crossdomain: true})
        .then(resp => {
            this.setState({
                topDebates: resp.data
            })
        })
        .catch(console.error)
    }
    
    showExistingDebates() {
        this.setState({
            showExistingDebates: !this.state.showExistingDebates
        });
    }
    
    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit = event => {
        event.preventDefault();
        const { searchQuery } = this.state;

        if(searchQuery && searchQuery !== '') {
            this.props.history.push({
                pathname: '/search',
                search: `searchQuery=${searchQuery}`
            });
        }
    }

    debateHandleClick = (argumentId) => {
        this.props.history.push(`/argument/${argumentId}`)
    }

    render() {
        let { searchQuery, topDebates } = this.state;

        return (
            <div className="home-container">
                <h1>Debatably</h1>
                <form className="form-inline search-form">
                    <FormControl 
                        type="search" 
                        name="searchQuery" 
                        value={searchQuery}
                        onChange={this.onChange}
                        placeholder="Search for Debates"
                        id="search-bar"
                    /><br/>
                    <Button variant="outline-info" type="submit" onClick={this.onSubmit} id="search-button">
                        Search
                    </Button>
                </form>

                <Card className="existing-debates-list">
                    <Card.Header  onClick={this.showExistingDebates.bind(this)}>
                        Existing Debates<br/>
                        <i className={`fas fa-angle-${this.state.showExistingDebates ? 'up' : 'down'}`}></i>
                    </Card.Header>
                    <ListGroup variant="flush" className={this.state.showExistingDebates ? "" : "collapse"}>
                        {topDebates && topDebates.map((argument) => 
                            <ListGroup.Item 
                                key={argument._id} 
                                name={argument._id} 
                                onClick={() => this.debateHandleClick(argument._id)}>
                                    {argument.title}
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </div>
        );
    }
}

export default HomePage;