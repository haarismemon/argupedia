const schemes = require('./schemes.js');

function generateLabelledNodesAndEdges(arguments) {
    if(!arguments) {
        arguments = [];
    }
    
    let nodesAndEdges = convertArgumentsToNodesAndEdges(arguments);

    nodesAndEdges = addSupportRelations(nodesAndEdges);

    const backupNodesMap = nodesAndEdges.nodes.reduce((obj, item) => {
        obj[item['id']] = item
        return obj;
      }, {});

    const supportedGroups = joinSupportedArguments(nodesAndEdges);

    // categorises the arguments into labels: IN, OUT, and UNDEC
    const labelledNodes = groundedLabellingAlgorithm(nodesAndEdges);

    // update the nodes with label colours
    nodesAndEdges.nodes = colourArgumentNodes(labelledNodes);

    ungroupSupportedArguments(supportedGroups, backupNodesMap, nodesAndEdges);

    return nodesAndEdges;
}

function convertArgumentsToNodesAndEdges(arguments) {
    let nodesAndEdges = {
        nodes: [],
        edges: []
    };

    arguments.forEach(argument => {
        const argumentId = argument._id.toString();
        let nodeTitle = argument.title ;
        nodeTitle = addNewlineInLabel(nodeTitle);

        const schemeName = schemes.SCHEMES[argument.scheme].name        
        nodesAndEdges.nodes.push({ 
            id: argumentId, 
            label: nodeTitle + `\n(${schemeName})`,
            borderWidth: 2
        })

        const criticalQuestion = schemes.QUESTIONS[argument.criticalQuestionTag];
        
        if(criticalQuestion !== undefined) {
            attackLabel = addNewlineInLabel(criticalQuestion.title + ' (' + (argument.agree ? 'Agree' : 'Disagree') + ')');
            
            isSymmetric = criticalQuestion.symmetric;
            if(isSymmetric) {
                const firstEdge = createEdge(argumentId, argument.parentId, attackLabel, argument.agree, isSymmetric, false, false);
                nodesAndEdges.edges.push(firstEdge)
                const secondEdge = createEdge(argumentId, argument.parentId, attackLabel, argument.agree, isSymmetric, true, false);
                nodesAndEdges.edges.push(secondEdge)
            } else {
                const edge = createEdge(argumentId, argument.parentId, attackLabel, argument.agree, isSymmetric, false, false);
                nodesAndEdges.edges.push(edge)
            }
        }
    })

    return nodesAndEdges;
}

function addSupportRelations(nodesAndEdges) {
    // convert data into map with a node as the key, and the value is a list of all nodes it attacks
    let attackedAndSupportedNodes = allAttackedAndSupportedArguments(nodesAndEdges);

    let breakLoop = false;
    // repeat iteration until number of edges are the same from the previous iteration
    while(!breakLoop) {
        let currentTotalEdges = nodesAndEdges.edges.slice();

        // for each node x if it attacks any node y, then find if y supports any nodes z.
        nodesAndEdges.nodes.forEach(nodeX => {
            if(attackedAndSupportedNodes[nodeX.id]) {
                //find all nodes that x attacks
                const allAttackedNodesByX = attackedAndSupportedNodes[nodeX.id].attack;
                
                allAttackedNodesByX.forEach(nodeYid => {
                    if(attackedAndSupportedNodes[nodeYid]) {
                        const allSupportedNodesByY = attackedAndSupportedNodes[nodeYid].support;
                        
                        allSupportedNodesByY.forEach(nodeZid => {
                            // for each z, creating a new special edge (be able to differentiate between normal edge by making it dashed) from x to z
                            
                            if(!attackedAndSupportedNodes[nodeX.id].attack.includes(nodeZid)) {
                                const newAttackEdge = createEdge(nodeX.id, nodeZid, "", false, false, false, true);
                                attackedAndSupportedNodes[nodeX.id].attack.push(nodeZid);
                                currentTotalEdges.push(newAttackEdge);
                            }
                        })
                    }
                })
            }
        });

        // check if the current iteration's edges are the same number as previous iteration. If so, stop; else continue.
        if(currentTotalEdges.length === nodesAndEdges.edges.length) {
            breakLoop = true;
        }
        nodesAndEdges.edges = currentTotalEdges;

    }
    // return new nodesAndEdges with same nodes, but with the new set of edges
    return nodesAndEdges
}

function joinSupportedArguments(nodesAndEdges) {
    const groups = {}

    let nextGroupId = 1;

    // sort the nodes into groups if they are supported
    for(let i = 0; i < nodesAndEdges.edges.length; ++i) {
        let edge = nodesAndEdges.edges[i];
        let fromEdge = edge.from;
        let toEdge = edge.to;

        const groupIdForFromEdge = whichGroupIsNodeIn(groups, fromEdge);
        const groupIdForToEdge = whichGroupIsNodeIn(groups, toEdge);
        if(edge.isSupport) {
            if(!groupIdForFromEdge && !groupIdForToEdge) {
                groups[nextGroupId] = [fromEdge, toEdge];
            } else if (!groupIdForFromEdge) {
                groups[groupIdForToEdge].push(fromEdge);
            } else if (!groupIdForToEdge) {
                groups[groupIdForFromEdge].push(toEdge);
            }
        } 
        
        nextGroupId += 1;
    };

    // update the edges with the group id labels
    for(let i = 0; i < nodesAndEdges.edges.length; ++i) {
        let edge = nodesAndEdges.edges[i];
        let fromEdge = edge.from;
        let toEdge = edge.to;

        // if the attacked argument (toEdge) is in a group, change the edge id to be the group id
        const newGroupIdForFromEdge = whichGroupIsNodeIn(groups, fromEdge);
        const newGroupIdForToEdge = whichGroupIsNodeIn(groups, toEdge);
        
        // if both nodes are part of a group, then leave unchanged to prevent unneccesary edges within a group
        if(!(newGroupIdForFromEdge && newGroupIdForToEdge)) {
            if(newGroupIdForFromEdge) {
                edge.originalFrom = edge.from;
                edge.from = newGroupIdForFromEdge;
            }
            if(newGroupIdForToEdge) {
                edge.originalTo = edge.to;
                edge.to = newGroupIdForToEdge;
            }
        }
    }

    let newNodes = [];
    let alreadyAddedGroups = [];

    nodesAndEdges.nodes.forEach(node => {
        const groupId = whichGroupIsNodeIn(groups, node.id);
        if(groupId) {
            if(!alreadyAddedGroups.includes(groupId)) {
                newNodes.push({
                    id: groupId,
                    label: groupId,
                });
                alreadyAddedGroups.push(groupId);
            }
        } else {
            newNodes.push(node);
        }
    })

    nodesAndEdges.nodes = newNodes;

    return groups;
}

function ungroupSupportedArguments(supportedGroups, backupNodesMap, nodesAndEdges) {
    let newNodesList = [];
    let groupIdsList = [];

    //go through the current nodes in nodesAndEdges.
    nodesAndEdges.nodes.forEach(node => {
        const nodeIdsInGroup = supportedGroups[node.id];
        
        //if a node exists in the supported groups list, then loop through all the nodes in the group (in supportedGroups) and add them back to nodesAndEdges whilst adding their new labels and colours
        if(nodeIdsInGroup) {
            const groupId = node.id;
            delete node.id;
            delete node.label;

            groupIdsList.push(groupId);

            nodeIdsInGroup.forEach(supportedNodeId => {
                const originalNode = backupNodesMap[supportedNodeId];
                const newNode = {...originalNode, ...node};
                newNodesList.push(newNode);
            });
        } else {
            newNodesList.push(node);
        }
    });

    // go through the edges and replace the group ids with the actual node ids
    for(let i in nodesAndEdges.edges) {
        let edge = nodesAndEdges.edges[i];
        const originalTo = edge.originalTo;
        const originalFrom = edge.originalFrom;

        if(originalTo) {
            edge.to = originalTo;
            delete edge.originalTo;
        }
        if(originalFrom) {
            edge.from = originalFrom;
            delete edge.originalFrom;
        }
    }

    nodesAndEdges.nodes = newNodesList;
}

function whichGroupIsNodeIn(groups, nodeId) {
    let foundGroupId;

    Object.keys(groups).forEach(groupId => {
        const group = groups[groupId];
        
        if(group.includes(nodeId)) {
            foundGroupId = groupId;
        }
    })

    return foundGroupId;
}

function allAttackedAndSupportedArguments(nodesAndEdges) {
    let allAttackedAndSupportedArguments = {}

    nodesAndEdges.edges.forEach(edge => {
        const attackingArgument = edge.from;
        const attackedArgument = edge.to;
        const isSupport = edge.isSupport;
        // delete edge.isSupport;

        let currentAttackedArguments = allAttackedAndSupportedArguments[attackingArgument];
        if(currentAttackedArguments) {
            if(isSupport) {
                currentAttackedArguments.support.push(attackedArgument);
            } else {
                currentAttackedArguments.attack.push(attackedArgument);
            }
        } else {
            if(isSupport) {
                currentAttackedArguments = {
                    support: [ attackedArgument ],
                    attack: []
                }
            } else {
                currentAttackedArguments = {
                    support: [],
                    attack: [attackedArgument]
                }
            }
        }

        allAttackedAndSupportedArguments[attackingArgument] = currentAttackedArguments;
    });

    return allAttackedAndSupportedArguments;
}

function groundedLabellingAlgorithm(nodesAndEdges) {
    const allNodes = nodesAndEdges.nodes;

    // start of with all labels being empty
    let currentLabelling = {
        in: [],
        out: []
    }

    let breakLoop = false;

    // keep repeating until previous iteration labelling = current iteration labelling
    while(!breakLoop) {
        let newLabelling = {
            in: [...currentLabelling.in],
            out: [...currentLabelling.out]
        }

        const unlabelledArguments = calculateUnlabelledArguments(currentLabelling, allNodes);

        // label x IN if it is not labelled, and all arguments that attack x are out
        unlabelledArguments.forEach(node => {
            // get all arguments that attack the current node
            const allAttackingArguments = getAllAttackingArguments(nodesAndEdges, node);
            
            let allAttackingArgumentsAreOut = true;
            allAttackingArguments.forEach(attackingArgumentId => {
                // if attackingArgumentId is not in OUT then set to false
                if(!currentLabelling.out.some(a => a.id == attackingArgumentId)) {
                    allAttackingArgumentsAreOut = false;
                }
            });

            // if all are out, then add node to IN
            if(allAttackingArgumentsAreOut) {
                newLabelling.in.push(node);
            }
        });

        // label x OUT if it is not labelled, and there is an argument that attacks it that is IN (in current iteration)
        unlabelledArguments.forEach(node => {
            // get all arguments that attack the current node
            const allAttackingArguments = getAllAttackingArguments(nodesAndEdges, node);
            
            let oneAttackingArgumentIsIn = false;    
            allAttackingArguments.forEach(attackingArgumentId => {
                if(newLabelling.in.some(a => a.id == attackingArgumentId)) {
                    oneAttackingArgumentIsIn = true;
                }
            });

            // if there is one attacking that is IN, then add node to OUT
            if(oneAttackingArgumentIsIn) {
                newLabelling.out.push(node);
            }
        });

        if(newLabelling.in.length === currentLabelling.in.length && 
            newLabelling.out.length === currentLabelling.out.length) {
                breakLoop = true;
        }
        
        currentLabelling = newLabelling;
    }

    // assign remaining arguments to the undecided label
    currentLabelling.undec = calculateUnlabelledArguments(currentLabelling, allNodes);

    return currentLabelling;
}

function colourArgumentNodes(labelledNodes) {
    let colouredNodes = []

    labelledNodes.in.forEach(inNode => {
        inNode.color = {
            background: "lime",
            border: "darkGreen",
            highlight: {
                background: "mediumSeaGreen",
                border: "darkGreen"
            }
        };
        colouredNodes.push(inNode);
    });

    labelledNodes.out.forEach(outNode => {
        outNode.color = {
            background: "orangered",
            border: "maroon",
            highlight: {
                background: "crimson",
                border: "maroon"
            }
        };
        outNode.font = {
            color: "white"
        }
        colouredNodes.push(outNode);
    });

    labelledNodes.undec.forEach(undec => {
        undec.color = {
            background: "white",
        };
        colouredNodes.push(undec);
    });

    return colouredNodes;
}

function calculateUnlabelledArguments(currentLabelling, allNodes) {
    const union = new Set(currentLabelling.in.concat(currentLabelling.out));
    return allNodes.filter(argument => !union.has(argument));
}

function getAllAttackingArguments(nodesAndEdges, node) {
    let attackingArguments = [];

    nodesAndEdges.edges.forEach(attack => {
        const attackingArgument = attack.from;
        const attackedArgument = attack.to;

        // store the attacking argument, if the argument being attacked matches the id of the provided node
        if(attackedArgument == node.id) {
            attackingArguments.push(attackingArgument);
        }
    });

    return attackingArguments;
}

function addNewlineInLabel(label) {
    let result = "";
    let words = label.split(' ');
    let count = 0;

    words.forEach(word => {
        count += 1;

        if(count == 5) {
            result += word + "\n";
            count = 0;
        } else {
            result += word + " ";
        }
    })

    return result;
}

function createEdge(fromNode, toNode, attackLabel, isSupport, isSymmetric, inOppositeDirection, isDashed) {
    let edge = {
        from: fromNode, 
        to: toNode,
        label: attackLabel,
        width: 2,
        isSupport
    }

    if(isSupport) {
        edge.arrows = {
            to: { enabled: true, scaleFactor: 1, type: 'circle' }
        }
    }

    if(isSymmetric) {
        edge.smooth = { type: 'curvedCW', roundness: 0.35 }

        if(inOppositeDirection) {
            const oppositeEdge = Object.assign({}, edge);;
            oppositeEdge.from = toNode;
            oppositeEdge.to = fromNode;

            return oppositeEdge;
        }
    }

    if(isDashed) {
        edge.dashes = true;
    }

    return edge;
}

module.exports = {
    generateLabelledNodesAndEdges
}