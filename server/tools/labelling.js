const schemes = require('./schemes.js');

function generateLabelledNodesAndEdges(argumentsMap, rootId, useLikes) {
    if(!argumentsMap) {
        argumentsMap = {};
    }
    
    let nodesAndEdges = convertArgumentsToNodesAndEdges(argumentsMap, rootId, useLikes);

    nodesAndEdges = addSupportRelations(nodesAndEdges);

    // categorises the arguments into labels: IN, OUT, and UNDEC
    groundedLabellingAlgorithm(nodesAndEdges);

    return nodesAndEdges;
}

function convertArgumentsToNodesAndEdges(argumentsMap, rootId, useLikes) {
    let nodesAndEdges = {
        nodes: [],
        edges: []
    };

    const arguments = Object.values(argumentsMap);

    arguments.forEach(argument => {
        const argumentId = argument._id.toString();
        let nodeTitle = argument.title ;
        nodeTitle = addNewlineInLabel(nodeTitle);

        const schemeName = schemes.SCHEMES[argument.scheme].name;
        // create a node for the argument
        let node = { 
            id: argumentId, 
            label: nodeTitle + `\n(${schemeName})`,
            borderWidth: 2
        };
        if(argumentId == rootId) {
            node.fixed = {
                x: true,
                y: true
            }
            node.x = 0;
            node.y = 0;
        }        

        nodesAndEdges.nodes.push(node)

        const criticalQuestion = schemes.QUESTIONS[argument.criticalQuestionTag];
        
        // if the argument is attacking another argument, then create an edge
        if(criticalQuestion !== undefined) {
            attackLabel = addNewlineInLabel(`${criticalQuestion.title} (${argument.agree ? 'Support' : 'Attack'})`);
            
            isSymmetric = criticalQuestion.symmetric;
            // if critical question is symmetric then create two edges, else create a single edge
            if(isSymmetric) {
                const firstEdge = createEdge(argumentId, argument.parentId, attackLabel, argument.agree, isSymmetric, false, false);
                const secondEdge = createEdge(argumentId, argument.parentId, attackLabel, argument.agree, isSymmetric, true, false);

                // if use likes is true, only create  an edge from the argument that has the highest number of likes
                if(useLikes) {
                    const firstLikeCount = argument.likes.length;
                    const secondLikeCount = argumentsMap[argument.parentId].likes.length;

                    if(firstLikeCount > secondLikeCount) {
                        delete firstEdge.smooth
                        nodesAndEdges.edges.push(firstEdge)
                    } else if (secondLikeCount > firstLikeCount) {
                        delete secondEdge.smooth
                        nodesAndEdges.edges.push(secondEdge)
                    } else {
                        nodesAndEdges.edges.push(firstEdge)
                        nodesAndEdges.edges.push(secondEdge)
                    }

                } else {
                    nodesAndEdges.edges.push(firstEdge)
                    nodesAndEdges.edges.push(secondEdge)
                }

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

function allAttackedAndSupportedArguments(nodesAndEdges) {
    let allAttackedAndSupportedArguments = {}

    // sort each edge into supported and attacked list
    nodesAndEdges.edges.forEach(edge => {
        const attackingArgument = edge.from;
        const attackedArgument = edge.to;
        const isSupport = edge.isSupport;

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
                node.group = 'inNode';
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
                node.group = 'outNode';
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

    nodesAndEdges.nodes = [...currentLabelling.in, ...currentLabelling.out, ...currentLabelling.undec];
}

function calculateUnlabelledArguments(currentLabelling, allNodes) {
    const union = new Set(currentLabelling.in.concat(currentLabelling.out));
    return allNodes.filter(argument => {
        if(!union.has(argument)) {
            argument.group = "undecNode";
            return true;
        } else {
            return false;
        }
        
    });
}

function getAllAttackingArguments(nodesAndEdges, node) {
    let attackingArguments = [];

    nodesAndEdges.edges.forEach(attack => {
        const attackingArgument = attack.from;
        const attackedArgument = attack.to;

        // store the attacking argument, if the argument being attacked matches the id of the provided node
        if(attackedArgument == node.id && !attack.isSupport) {
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
        arrows: {
            to: { enabled: true, scaleFactor: 2, type: 'arrow' }
        },
        isSupport
    }

    if(isSupport) {
        edge.arrows.to.type = 'circle';
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
        edge.dashes = [20];
    }

    return edge;
}

module.exports = {
    generateLabelledNodesAndEdges
}