import React from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'

import * as ROUTES from '../../../constants/routes'
import ArgumentView from '../ArgumentDetailsPage/ArgumentView'
import loadingAnimation from '../../../resources/Reload-1s-100px.svg';

class SearchResultsPage extends React.Component {
  state = {
    results: [],
    searchQuery: '',
    pageLoading: true
  }
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    const params = new URLSearchParams(this.props.location.search)
    const searchQuery = params.get('searchQuery')

    this.setState({searchQuery});

    Axios.get(`${ROUTES.ARGUMENT_LIST_SEARCH}?searchQuery=${searchQuery}`, {crossdomain: true})
    .then(resp => {
      if(this._isMounted) {
        this.setState({
            results: resp.data,
            pageLoading: false
        })
      }
    })
    .catch(console.error)
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  

  handleClick(argumentId) {
    this.props.history.push(`/argument/${argumentId}`)
  }

  render() {
    const {results, searchQuery} = this.state;

    return this.state.pageLoading ? 
      (<div className="loading-animation" style={{textAlign: 'center'}}>
        <h1>Loading...</h1>
        <img src={loadingAnimation} alt="LoadingAnimation"/>
      </div>) :
      (<div>
        { results.length > 0 ? 
          (<div>
            <h3>Search Results for: '{searchQuery}'</h3>
            {results.map (argument =>
              <ArgumentView 
                key={argument._id} 
                argument={argument} 
                onClick={this.handleClick.bind(this)}
                isPreview={true} />
              )
            }
          </div>
          )
          : 
          (<div>
            <h3>No results found for: '{searchQuery}'</h3>
            <Link to={ROUTES.HOME}>Go back to home page</Link>
          </div>)
        }
      </div>
    );
  }
}

export default SearchResultsPage;
