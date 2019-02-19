function generateLabelledNodesAndAttacks(arguments) {
    let nodesAndAttacks = convertArgumentsToNodesAndAttacks(arguments);

    // categorises the arguments into labels: IN, OUT, and UNDEC
    const labelledNodes = groundedLabellingAlgorithm(nodesAndAttacks);

    // update the nodes with label colours
    nodesAndAttacks.nodes = colourArgumentNodes(labelledNodes);

    return nodesAndAttacks;
}

function convertArgumentsToNodesAndAttacks(arguments) {
    let nodesAndAttacks = {
        nodes: [],
        edges: []
    };

    arguments.forEach(argument => {
        let nodeTitle = argument.title ;
        nodeTitle = addNewlineInLabel(nodeTitle);

        nodesAndAttacks.nodes.push({ 
            id: argument._id, 
            label: nodeTitle
        })

        let argumentLabel = argument.criticalQuestion + ' (' + (argument.agree ? 'Agree' : 'Disagree') + ')';
        argumentLabel = addNewlineInLabel(argumentLabel);

        if(argument.parentId != null) {
            if(argument._id != '5c570b4a90cebb4864b4a9c2') {
                    nodesAndAttacks.edges.push({ 
                    from: argument._id, 
                    to: argument.parentId,
                    label: argumentLabel
                })
            } else {
                // dummy edge from parent to child (child to parent already existing)
                    nodesAndAttacks.edges.push({ 
                    from: argument._id, 
                    to: argument.parentId,
                    label: argumentLabel,
                    smooth: {type: 'curvedCW', roundness: 0.3}
                }, { 
                    from: argument.parentId, 
                    to: argument._id,
                    label: "Alternative action (negative)",
                    smooth: {type: 'curvedCW', roundness: 0.3}
                })
            }
        }
    })

    return nodesAndAttacks;
}

function groundedLabellingAlgorithm(nodesAndAttacks) {
    const allNodes = nodesAndAttacks.nodes;

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
            const allAttackingArguments = getAllAttackingArguments(nodesAndAttacks, node);
            
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
            const allAttackingArguments = getAllAttackingArguments(nodesAndAttacks, node);
            
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

    colouredNodes = colouredNodes.concat(labelledNodes.undec);

    return colouredNodes;
}

function calculateUnlabelledArguments(currentLabelling, allNodes) {
    const union = new Set(currentLabelling.in.concat(currentLabelling.out));
    return allNodes.filter(argument => !union.has(argument));
}

function getAllAttackingArguments(nodesAndAttacks, node) {
    let attackingArguments = [];

    nodesAndAttacks.edges.forEach(attack => {
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

module.exports = {
    generateLabelledNodesAndAttacks
}