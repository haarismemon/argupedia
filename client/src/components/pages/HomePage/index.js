import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { FormControl } from 'react-bootstrap';

import './HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: ''
        }
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

    render() {
        let { searchQuery } = this.state;

        return (
            <div className="home-container">
                <h1>Debatably</h1>
                <form className="form-inline search-form">
                    <FormControl 
                        type="search" 
                        name="searchQuery" 
                        value={searchQuery}
                        onChange={this.onChange}
                        placeholder="Search"
                        id="search-bar"
                    />
                    <Button variant="primary" type="submit" onClick={this.onSubmit} id="search-button">
                        <i className="fas fa-search" aria-hidden="true"></i>
                    </Button>
                </form>
            </div>
        );
    }
}

export default HomePage;