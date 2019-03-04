const schemes = require('./schemes.js');

function generateLabelledNodesAndEdges(arguments) {
    if(!arguments) {
        arguments = [];
    }
    
    let nodesAndEdges = convertArgumentsToNodesAndEdges(arguments);

    nodesAndEdges = addSupportRelations(nodesAndEdges);

    // categorises the arguments into labels: IN, OUT, and UNDEC
    const labelledNodes = groundedLabellingAlgorithm(nodesAndEdges);

    // update the nodes with label colours
    nodesAndEdges.nodes = colourArgumentNodes(labelledNodes);

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
                    // console.log(nodeY, attackedAndSupportedNodes[nodeY]);
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

    nodesAndEdges.edges.forEach(edge => {
        const attackingArgument = edge.from;
        const attackedArgument = edge.to;
        const isSupport = edge.isSupport;
        delete edge.isSupport;

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
        edge.dashes = true;
    }

    return edge;
}

module.exports = {
    generateLabelledNodesAndEdges
}