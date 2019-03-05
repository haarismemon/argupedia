import React, { Component } from 'react';

import ArgumentNest from '../ArgumentDetailsPage/ArgumentNest'
import ArgumentView from './ArgumentView';

class ArgumentDetails extends Component {
    render() {
        const { argumentNestData, originalArgument, highlightId, rootId, isRootNotOriginalArgument, originalArgumentLinkHandler } = this.props;

        return (
            <div>
                {isRootNotOriginalArgument &&
                  <div>
                    <br/>
                    <p>Preview of the original argument (click below to show full debate):</p>
                    <ArgumentView 
                      argument={originalArgument}
                      isPreview={true}
                      onClick={originalArgumentLinkHandler}/>
                    <hr/>
                  </div>
                }
                <ArgumentNest 
                  level={0} 
                  rootId={rootId} 
                  currentId={rootId}
                  argumentData={argumentNestData}
                  highlightId={highlightId}/>
            </div>
        );
    }
}

export default ArgumentDetails;