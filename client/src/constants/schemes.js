/* eslint-disable no-template-curly-in-string */

const QUESTIONS = {
    action1: {
        question: "Is the current circumstance '${circumstance}' true?",
        title: "Is the current circumstance true?",
        symmetric: false
    },
    action2: {
        question: "Does the action '${action}' achieve the goal of '${goal}'?",
        title: "Does the action achieve the goal?",
        symmetric: false
    },
    action3: {
        question: "Is there an alternative action that achieves the goal '${goal}'?",
        title: "Is there an alternative action that achieves the same goal?",
        symmetric: true
    },
    
    expert1: {
        question: "How credible is '${source}' an expert?",
        title: "How credible is the source an expert?",
        symmetric: false
    },
    expert2: {
        question: "Is '${source}' an expert in the field that the assertion '${assertion}' is in?",
        title: "Is the source an expert in the field of the assertion?",
        symmetric: false
    },
    expert3: {
        question: "Is the assertion '${assertion}' consistent with what other experts assert?",
        title: "Is the assertion consistent with what other experts assert?",
        symmetric: true
    },

    popular1: {
        question: "What evidence do we have for believing that '${proposition}' is generally accepted?",
        title: "What evidence do we have for believing that the proposition is generally accepted?",
        symmetric: false
    },
    popular2: {
        question: "Are there good reasons for doubting the accuracy of '${proposition}'?",
        title: "Are there good reasons for doubting the accuracy of the proposition'?",
        symmetric: false
    }
}

const SCHEMES = {
    action: {
        scheme: 'action',
        name: 'Argument for Action',
        criticalQuestions: ['action1', 'action2', 'action3']
    },
    expert: {
        scheme: 'expert',
        name: 'Argument from Expert Opinion',
        criticalQuestions: ['expert1', 'expert2', 'expert3']
    },
    popular: {
        scheme: 'popular',
        name: 'Argument from Popular Opinion',
        criticalQuestions: ['popular1', 'popular2']
    }
}

export { SCHEMES, QUESTIONS };