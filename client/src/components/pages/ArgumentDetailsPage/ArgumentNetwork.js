import React, { Component } from 'react';
import Graph from 'vis-react';
import { Card } from 'react-bootstrap';

class ArgumentNetwork extends Component {
    state = {
        network: null
    }

    render() {
        const {network} = this.state;
        const {networkData} = this.props;

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
        
        if(this.state.network !== null) {
            this.state.network.fit()
        }

        return (
            <div id="network-page">
              <Card className="key-card">
                <Card.Header>Argument Label Key</Card.Header>
                <Card.Body className="container">
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
                </Card.Body>
              </Card>
              <p className="network-info"><strong>Double click on a node to get more information. Selected argument becomes the root of the argument nest.</strong></p>
              <div id="argument-network">
                <Graph 
                  graph={networkData} 
                  options={options} 
                  events={events} 
                  getNetwork={network => this.setState({network})} />
              </div>
            </div>
        );
    }
}

export default ArgumentNetwork;