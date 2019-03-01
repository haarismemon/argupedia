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
        criticalQuestions: ['action1', 'action2', 'action3'],
        inputQuestions: {
            circumstance: "The current circumstance is...",
            action: "By performing the following action... ",
            newCircumstance: "Will result in the following new circumstance.... ",
            goal: "This will achieve the goal.... ",
            value: "Which will promote the following value... ",
        }
    },
    expert: {
        scheme: 'expert',
        name: 'Argument from Expert Opinion',
        criticalQuestions: ['expert1', 'expert2', 'expert3'],
        inputQuestions: {
            source: "There is an expert who is... ",
            domain: "Where the subject domain they are an expert in is... ",
            assertion: "The source who is an expert makes the assertion... ",
        }
    },
    popular: {
        scheme: 'popular',
        name: 'Argument from Popular Opinion',
        criticalQuestions: ['popular1', 'popular2'],
        inputQuestions: {
            proposition: "There is a proposition that is generally accepted as being true, which is... "
        }
    }
}

exports.QUESTIONS = QUESTIONS;
exports.SCHEMES = SCHEMES;