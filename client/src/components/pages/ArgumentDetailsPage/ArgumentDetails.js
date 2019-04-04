import React from 'react';

import ArgumentNest from '../ArgumentDetailsPage/ArgumentNest'
import ArgumentView from './ArgumentView';

const ArgumentDetails = (props) => (
  <div>
      {props.isRootNotOriginalArgument &&
        <div>
          <br/>
          <p>Preview of the original argument (click below to show full debate):</p>
          <ArgumentView 
            argument={props.originalArgument}
            isPreview={true}
            onClick={props.originalArgumentLinkHandler}/>
          <hr/>
        </div>
      }
      <ArgumentNest 
        level={0} 
        rootId={props.rootId} 
        currentId={props.rootId}
        argumentData={props.argumentNestData}
        highlightId={props.highlightId}/>
  </div>
)

export default ArgumentDetails;