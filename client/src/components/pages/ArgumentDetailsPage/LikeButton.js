import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withFirebase } from '../../Firebase';


class LikeButton extends Component {
    state = {
        likeButton: true
    }

    componentDidMount() {
        this._isMounted = true;

        this.props.firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                let newLikes = this.props.argument.likes;
                if(newLikes.includes(user.uid) && this._isMounted) {
                    this.setState({likeButton: false});
                }
            } else {
                if(this._isMounted) {
                    this.setState({likeButton: true});
                }
            }
        });   
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleClick = (event) => {
        this.props.firebase.auth.onAuthStateChanged((user) => {
            if (user && this._isMounted) {
                this.setState({likeButton: !this.state.likeButton});
            }
        });  

        this.props.handleLikeButtonClick();
    }
    
    render() {
        const {argument} = this.props;
        const {likeButton} = this.state;

        const likeCount = argument.likes.length;
        let likeString = " Likes"

        if(likeCount === 1) {
            likeString = " Like"
        }

        return (
            <div>
                <span className="like-count">{likeCount + likeString}</span>
                <Button variant="info" onClick={this.handleClick}>
                    {likeButton ? 
                        (<div>Like Argument <i className="far fa-heart"></i></div>) : 
                        (<div>Unlike Argument <i className="fas fa-heart"></i></div>)
                    }
                    
                </Button>
            </div>
        );
    }
}

export default withFirebase(LikeButton);