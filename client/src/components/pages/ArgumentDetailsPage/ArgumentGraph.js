import React, { Component } from 'react';
import Graph from 'vis-react';
import { Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

class ArgumentGraph extends Component {
    state = {
        network: null,
        showInformation: false,
        useLikes: false
    }
    componentDidMount() {
        this.setState({useLikes: this.props.isLike});
    }

    showInformation() {
        this.setState({
            showInformation: !this.state.showInformation
        });
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.props.saveLikeCheckBox(value);

        this.setState({
            [name]: value
        }, () => {
            this.props.updateGraphData(this.props.rootId, this.state.useLikes);
        });
    }

    render() {
        const {network} = this.state;
        const {graphData} = this.props;

        // after the nodes have been settled and after 2 seconds, make the network fit the screen
        if(network) {
            setTimeout(() => {
                network.fit({
                    animation: {
                        duration: 4000
                    }
                })
            }, 3000);
        }

        let options = {
        physics: {
            solver: 'repulsion',
            repulsion: {
                centralGravity: 0.000001,
                springLength: 400,
                springConstant: 0.001,
                nodeDistance: 700,
                damping: 0.15
            },
            barnesHut: {
                avoidOverlap: 1
            }
        },
        interaction: {
            navigationButtons: true,
            zoomView: false
        },
        groups: {
            inNode: {
                color: {
                    background: "lime",
                    border: "darkGreen",
                    highlight: {
                        background: "mediumSeaGreen",
                        border: "darkGreen"
                    }
                }
            },
            outNode: {
                color: {
                    background: "orangered",
                    border: "maroon",
                    highlight: {
                        background: "crimson",
                        border: "maroon"
                    },
                    font: {
                        color: "white"
                    }
                }
            },
            undecNode: {
                color: {
                    background: "white",
                    border: "black",
                }
            }
        }
        };

        let events = {
            doubleClick: this.props.nodeSelectHandler
        }
        
        if(network !== null) {
            network.fit()
        }

        return (
            <div id="graph-page">
              <Card className="info-card">
                <Card.Header id="info-toggle-header" onClick={this.showInformation.bind(this)}>Labelling and Graph Information</Card.Header>
                <Card.Body className={`container ${this.state.showInformation ? "" : "collapse"}`}>
                  <div className="row">
                    <div className="col-sm">
                      <div className="key-node in-key-node"/>
                      <label className="key-label">IN Label</label>
                    </div>
                    <div className="col-sm">
                      <div className="key-node out-key-node"/>
                      <label className="key-label">OUT Label</label>
                    </div>
                    <div className="col-sm">
                      <div className="key-node undec-key-node"/>
                      <label className="key-label">UNDEC Label</label>
                    </div>
                  </div>
                  <hr/>
                  <div>
                    <div className="graph-instructions">
                        1. Double click on a node to see the details of the selected argument.<br/>
                        2. To change the layout of the graph, simply single click and hold on a node and drag to any position. <br/>
                        3. To navigate around the argument graph use the navigation buttons at the bottom such as zoom and fit to screen.
                     </div>
                  </div>
                </Card.Body>
              </Card>
              <div>
              <Form.Group controlId="formBasicChecbox" className="like-form">
                <Form.Check 
                    name="useLikes"
                    type="checkbox" 
                    label="Check to use number of likes to decide the accepted arguments between symmetrically (two-way) attacking arguments"
                    checked={this.state.useLikes}
                    onChange={this.handleInputChange} />
              </Form.Group>
              </div>
              <div id="argument-graph">
                <Graph 
                  graph={graphData} 
                  options={options} 
                  events={events} 
                  getNetwork={network => this.setState({network})} />
              </div>
            </div>
        );
    }
}

export default ArgumentGraph;