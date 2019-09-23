/* eslint-disable no-template-curly-in-string */

const QUESTIONS = {
    action1: {
        question: "Is the current circumstance '${circumstance}' true?",
        title: "Is the current circumstance true?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    action2: {
        question: "Does the action '${action}' achieve the goal of '${goal}'?",
        title: "Does the action achieve the goal?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    action3: {
        question: "Is there an alternative action that achieves the goal '${goal}'?",
        title: "Is there an alternative action that achieves the same goal?",
        symmetric: true,
        ignoreSchemes: ['expert', 'popular', 'positionToKnow', 'causeToEffect']
    },
    
    expert1: {
        question: "How credible is the source '${source}' an expert?",
        title: "How credible is the source an expert?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    expert2: {
        question: "Is the source '${source}' an expert in the field that the assertion '${assertion}' is in?",
        title: "Is the source an expert in the field of the assertion?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    expert3: {
        question: "Is the assertion '${assertion}' consistent with what other experts assert?",
        title: "Is the assertion consistent with what other experts assert?",
        symmetric: true,
        ignoreSchemes: ['action']
    },

    popular1: {
        question: "What evidence do we have for believing that the proposition '${proposition}' is generally accepted?",
        title: "What evidence do we have for believing that the proposition is generally accepted?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    popular2: {
        question: "Are there good reasons for doubting the accuracy of the proposition '${proposition}'?",
        title: "Are there good reasons for doubting the accuracy of the proposition'?",
        symmetric: false,
        ignoreSchemes: ['action']
    },

    positionToKnow1: {
        question: "Is the source '${source}' really in a position to know whether the proposition '${proposition}' is true?",
        title: "Is the source really in a position to know whether the proposition is true?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    positionToKnow2: {
        question: "Is the source '${source}' an honest, trustworthy and reliable source?",
        title: "Is the source an honest, trustworthy and reliable source?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
    positionToKnow3: {
        question: "Did the source '${source}' really assert that the proposition '${proposition}' is true?",
        title: "Did the source really assert that the proposition is true?",
        symmetric: false,
        ignoreSchemes: ['action']
    },

    causeToEffect1: {
        question: "How strong is the casual generalisation?",
        title: "How strong is the casual generalisation?",
        symmetric: false,
        ignoreSchemes: ['action', 'causeToEffect']
    },
    causeToEffect2: {
        question: "Is the evidence '${evidence}' cited strong enough to warrant the generalisation as stated?",
        title: "Is the evidence cited strong enough to warrant the generalisation as stated?",
        symmetric: false,
        ignoreSchemes: ['action', 'causeToEffect']
    },
    causeToEffect3: {
        question: "Are there other factors that would or will intefere with or counteract the production of the effect '${effect}' in this case?",
        title: "Are there other factors that would or will intefere with or counteract the production of the effect in this case?",
        symmetric: false,
        ignoreSchemes: ['action']
    },
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
    },
    positionToKnow: {
        scheme: 'positionToKnow',
        name: 'Argument from the Position to Know',
        criticalQuestions: ['positionToKnow1', 'positionToKnow2', 'positionToKnow3'],
        inputQuestions: {
            source: "The source, that is in a position to know, is...",
            proposition: "The source asserts that... "
        }
    },
    causeToEffect: {
        scheme: 'causeToEffect',
        name: 'Argument from Cause to Effect',
        criticalQuestions: ['causeToEffect1', 'causeToEffect2', 'causeToEffect3'],
        inputQuestions: {
            cause: "The cause that occurs is...",
            effect: "Hence the effect that will (or might) occur is... ",
            evidence: "The evidence to support the generalisation between the cause and effect is..."
        }
    }
}

exports.QUESTIONS = QUESTIONS;
exports.SCHEMES = SCHEMES;